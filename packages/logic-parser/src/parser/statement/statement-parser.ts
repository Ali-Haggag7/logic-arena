import {
    ActionStatement,
    AssignmentStatement,
    BreakStatement,
    CallStatement,
    ContinueStatement,
    Expression,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    NodeType,
    QueryStatement,
    ReturnStatement,
    ScanStatement,
    Statement,
    TokenType,
    WaitStatement,
    WhileStatement,
} from "../../types";
import type { Parser } from "../parser";
import { currentTokenIs, peekTokenIs } from "../token-guards";
import { ACTION_KEYWORDS } from "./statement.constants";

type StatementParserFn = () => Statement | null;

export class StatementParser {
    private readonly keywordParsers: ReadonlyMap<string, StatementParserFn>;

    constructor(private readonly parser: Parser) {
        this.keywordParsers = new Map<string, StatementParserFn>([
            ["IF", this.parseIfStatement],
            ["WHILE", this.parseWhileStatement],
            ["FOR", this.parseForStatement],
            ["FUNCTION", this.parseFunctionDeclaration],
            ["CALL", this.parseCallStatement],
            ["WAIT", this.parseWaitStatement],
            ["SCAN", this.parseScanStatement],
            ["SET", this.parseAssignmentStatement],
            ["BREAK", () => ({ type: NodeType.BreakStatement } as BreakStatement)],
            ["CONTINUE", () => ({ type: NodeType.ContinueStatement } as ContinueStatement)],
            ["RETURN", this.parseReturnStatement],
        ]);
    }

    public parseStatement(): Statement | null {
        if (currentTokenIs(this.parser, TokenType.QUERY_CALL)) return this.parseQueryStatement();
        if (!currentTokenIs(this.parser, TokenType.KEYWORD)) return null;

        const keyword = this.parser.currentToken.value;
        const parser = this.keywordParsers.get(keyword);

        if (parser) return parser.call(this);
        if (ACTION_KEYWORDS.has(keyword)) return this.parseActionStatement();

        return null;
    }

    private parseBlockStatement(endTokens: readonly string[]): Statement[] {
        const body: Statement[] = [];
        this.parser.nextToken();

        while (!currentTokenIs(this.parser, TokenType.EOF) && !this.isCurrentBlockTerminator(endTokens)) {
            const statement = this.parseStatement();
            if (statement) body.push(statement);
            this.parser.nextToken();
        }

        return body;
    }

    private parseIfStatement(): IfStatement | null {
        this.parser.nextToken();
        const condition = this.parser.expressionParser.parseExpression();
        if (!condition || !this.expectCurrentKeywordAfterPeek("THEN")) return null;

        const consequence = this.parseBlockStatement(["ELSE", "END"]);
        const alternate = this.parser.currentToken.value === "ELSE"
            ? this.parseBlockStatement(["END"])
            : undefined;

        return { type: NodeType.IfStatement, condition, consequence, alternate };
    }

    private parseWhileStatement(): WhileStatement | null {
        this.parser.nextToken();
        const condition = this.parser.expressionParser.parseExpression();
        if (!condition || !this.expectCurrentKeywordAfterPeek("DO")) return null;

        return { type: NodeType.WhileStatement, condition, body: this.parseBlockStatement(["END"]) };
    }

    private parseForStatement(): ForStatement | null {
        const variable = this.expectIdentifier();
        if (!variable || !this.parser.expectPeek(TokenType.ASSIGN)) return null;

        this.parser.nextToken();
        const start = this.parser.expressionParser.parseExpression();
        if (!start || !this.expectCurrentKeywordAfterPeek("TO")) return null;

        this.parser.nextToken();
        const end = this.parser.expressionParser.parseExpression();
        if (!end || !this.expectCurrentKeywordAfterPeek("DO")) return null;

        return { type: NodeType.ForStatement, variable, start, end, body: this.parseBlockStatement(["END"]) };
    }

    private parseFunctionDeclaration(): FunctionDeclaration | null {
        const name = this.expectIdentifier();
        if (!name) return null;

        const params = peekTokenIs(this.parser, TokenType.LPAREN) ? this.parseIdentifierList() : undefined;
        return { type: NodeType.FunctionDeclaration, name, params, body: this.parseBlockStatement(["END"]) };
    }

    private parseCallStatement(): CallStatement | null {
        const functionName = this.expectIdentifier();
        if (!functionName) return null;

        const args = peekTokenIs(this.parser, TokenType.LPAREN) ? this.parseArgumentList() : undefined;
        return { type: NodeType.CallStatement, functionName, args };
    }

    private parseWaitStatement(): WaitStatement | null {
        if (!this.parser.expectPeek(TokenType.NUMBER)) return null;

        return {
            type: NodeType.WaitStatement,
            ticks: { type: NodeType.NumberLiteral, value: parseFloat(this.parser.currentToken.value) },
        };
    }

    private parseScanStatement(): ScanStatement {
        return { type: NodeType.ScanStatement };
    }

    private parseAssignmentStatement(): AssignmentStatement | null {
        const name = this.expectIdentifier();
        if (!name) return null;

        const target = this.parseAssignmentTarget();
        if (!this.parser.expectPeek(TokenType.ASSIGN)) return null;

        this.parser.nextToken();
        const value = this.parser.expressionParser.parseExpression();
        if (!value) return null;

        return { type: NodeType.AssignmentStatement, name, value, ...target };
    }

    private parseAssignmentTarget(): Pick<AssignmentStatement, "index" | "property"> {
        if (peekTokenIs(this.parser, TokenType.DOT)) {
            this.parser.nextToken();
            if (!peekTokenIs(this.parser, TokenType.IDENTIFIER)) return {};
            this.parser.nextToken();
            return { property: this.parser.currentToken.value };
        }

        if (peekTokenIs(this.parser, TokenType.LBRACKET)) {
            this.parser.nextToken();
            this.parser.nextToken();
            const index = this.parser.expressionParser.parseExpression() ?? undefined;
            if (peekTokenIs(this.parser, TokenType.RBRACKET)) this.parser.nextToken();
            return { index };
        }

        return {};
    }

    private parseActionStatement(): ActionStatement {
        const command = this.parser.currentToken.value;
        const args: ActionStatement["consequence"]["args"] = [];

        while (this.peekCanStartActionArgument()) {
            this.parser.nextToken();
            const arg = this.parser.expressionParser.parseExpression();
            if (arg && this.isActionArgument(arg)) args.push(arg);
        }

        return { type: NodeType.ActionStatement, consequence: { type: NodeType.ActionExpression, command, args } };
    }

    private parseQueryStatement(): QueryStatement {
        const query = this.parser.currentToken.value;

        if (peekTokenIs(this.parser, TokenType.LPAREN)) {
            this.parser.nextToken();
            if (peekTokenIs(this.parser, TokenType.RPAREN)) this.parser.nextToken();
        }

        return { type: NodeType.QueryStatement, query };
    }

    private parseReturnStatement(): ReturnStatement {
        if (!this.peekCanStartExpression()) return { type: NodeType.ReturnStatement };

        this.parser.nextToken();
        return {
            type: NodeType.ReturnStatement,
            value: this.parser.expressionParser.parseExpression() ?? undefined,
        };
    }

    private parseIdentifierList(): Identifier[] {
        this.parser.nextToken();
        const identifiers: Identifier[] = [];

        if (!peekTokenIs(this.parser, TokenType.RPAREN)) {
            const first = this.expectIdentifier();
            if (first) identifiers.push(first);

            while (peekTokenIs(this.parser, TokenType.COMMA)) {
                this.parser.nextToken();
                const identifier = this.expectIdentifier();
                if (identifier) identifiers.push(identifier);
            }
        }

        if (peekTokenIs(this.parser, TokenType.RPAREN)) this.parser.nextToken();
        return identifiers;
    }

    private parseArgumentList(): Expression[] {
        this.parser.nextToken();
        const args: Expression[] = [];

        if (!peekTokenIs(this.parser, TokenType.RPAREN)) {
            this.parser.nextToken();
            const firstArg = this.parser.expressionParser.parseExpression();
            if (firstArg) args.push(firstArg);

            while (peekTokenIs(this.parser, TokenType.COMMA)) {
                this.parser.nextToken();
                this.parser.nextToken();
                const arg = this.parser.expressionParser.parseExpression();
                if (arg) args.push(arg);
            }
        }

        if (peekTokenIs(this.parser, TokenType.RPAREN)) this.parser.nextToken();
        return args;
    }

    private expectIdentifier(): Identifier | null {
        if (!this.parser.expectPeek(TokenType.IDENTIFIER)) return null;
        return { type: NodeType.Identifier, value: this.parser.currentToken.value };
    }

    private expectCurrentKeywordAfterPeek(keyword: string): boolean {
        return this.parser.expectPeek(TokenType.KEYWORD) && this.parser.currentToken.value === keyword;
    }

    private isCurrentBlockTerminator(endTokens: readonly string[]): boolean {
        return currentTokenIs(this.parser, TokenType.KEYWORD) && endTokens.includes(this.parser.currentToken.value);
    }

    private peekCanStartExpression(): boolean {
        return this.peekCanStartActionArgument()
            || peekTokenIs(this.parser, TokenType.LPAREN)
            || peekTokenIs(this.parser, TokenType.LBRACKET)
            || peekTokenIs(this.parser, TokenType.LBRACE)
            || (peekTokenIs(this.parser, TokenType.KEYWORD) && ["TRUE", "FALSE", "NOT"].includes(this.parser.peekToken.value));
    }

    private peekCanStartActionArgument(): boolean {
        return peekTokenIs(this.parser, TokenType.NUMBER)
            || peekTokenIs(this.parser, TokenType.IDENTIFIER)
            || peekTokenIs(this.parser, TokenType.STRING);
    }

    private isActionArgument(expression: Expression): expression is NonNullable<ActionStatement["consequence"]["args"]>[number] {
        return expression.type === NodeType.Identifier
            || expression.type === NodeType.NumberLiteral
            || expression.type === NodeType.StringLiteral;
    }
}