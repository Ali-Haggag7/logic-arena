import { Token, TokenType, Program, NodeType } from "../types";
import { Lexer } from "../lexer";
import { ExpressionParser } from "./expression";
import { StatementParser } from "./statement";

export class Parser {
    private lexer: Lexer;
    public currentToken: Token;
    public peekToken: Token;

    public expressionParser: ExpressionParser;
    public statementParser: StatementParser;

    constructor(input: string) {
        this.lexer = new Lexer(input);
        this.currentToken = this.lexer.nextToken();
        this.peekToken = this.lexer.nextToken();

        this.expressionParser = new ExpressionParser(this);
        this.statementParser = new StatementParser(this);
    }

    public nextToken(): void {
        this.currentToken = this.peekToken;
        this.peekToken = this.lexer.nextToken();
    }

    public expectPeek(type: TokenType): boolean {
        if (this.peekToken.type === type) {
            this.nextToken();
            return true;
        }
        return false;
    }

    public parse(): Program {
        const program: Program = { type: NodeType.Program, body: [] };

        while (this.currentToken.type !== TokenType.EOF) {
            const statement = this.statementParser.parseStatement();
            if (statement) {
                program.body.push(statement);
            }
            this.nextToken();
        }
        return program;
    }
}
