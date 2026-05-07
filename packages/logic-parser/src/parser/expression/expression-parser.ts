import {
    ArrayLiteral,
    BinaryExpression,
    BooleanLiteral,
    Expression,
    FunctionCallExpression,
    IndexExpression,
    MemberExpression,
    NodeType,
    ObjectLiteral,
    ObjectProperty,
    TokenType,
    UnaryExpression,
} from "../../types";
import type { Parser } from "../parser";
import { currentTokenIs, peekTokenIs } from "../token-guards";
import {
    ADDITIVE_OPERATORS,
    BUILTIN_FUNCTION_NAMES,
    COMPARISON_OPERATORS,
    FORBIDDEN_OBJECT_KEYS,
    MAX_LITERAL_COLLECTION_ELEMENTS,
    MULTIPLICATIVE_OPERATORS,
} from "./expression.constants";

type ExpressionReader = () => Expression | null;

export class ExpressionParser {
    constructor(private readonly parser: Parser) { }

    /** Precedence tower: OR, AND, comparison, arithmetic, unary, postfix, primary. */
    public parseExpression(): Expression | null {
        return this.parseOrExpression();
    }

    public parseComparisonExpression(): Expression | null {
        const left = this.parseAddition();
        if (!left || !this.peekOperatorIs(COMPARISON_OPERATORS)) return left;

        this.parser.nextToken();
        const operator = this.parser.currentToken.value;
        this.parser.nextToken();

        const right = this.parseAddition();
        return right ? { type: NodeType.ComparisonExpression, left, operator, right } : null;
    }

    public parseAddition(): Expression | null {
        return this.parseLeftAssociative(this.parseMultiply, ADDITIVE_OPERATORS);
    }

    public parseMultiply(): Expression | null {
        return this.parseLeftAssociative(this.parseUnaryExpression, MULTIPLICATIVE_OPERATORS);
    }

    private parseOrExpression(): Expression | null {
        return this.parseKeywordBinary(this.parseAndExpression, "OR");
    }

    private parseAndExpression(): Expression | null {
        return this.parseKeywordBinary(this.parseComparisonExpression, "AND");
    }

    private parseKeywordBinary(readOperand: ExpressionReader, operator: string): Expression | null {
        let left = readOperand.call(this);
        if (!left) return null;

        while (peekTokenIs(this.parser, TokenType.KEYWORD) && this.parser.peekToken.value === operator) {
            this.parser.nextToken();
            this.parser.nextToken();

            const right = readOperand.call(this);
            if (!right) return null;

            left = { type: NodeType.BinaryExpression, left, operator, right } as BinaryExpression;
        }

        return left;
    }

    private parseLeftAssociative(readOperand: ExpressionReader, operators: ReadonlySet<string>): Expression | null {
        let left = readOperand.call(this);
        if (!left) return null;

        while (this.peekOperatorIs(operators)) {
            this.parser.nextToken();
            const operator = this.parser.currentToken.value;
            this.parser.nextToken();

            const right = readOperand.call(this);
            if (!right) return null;

            left = { type: NodeType.BinaryExpression, left, operator, right } as BinaryExpression;
        }

        return left;
    }

    private parseUnaryExpression(): Expression | null {
        const token = this.parser.currentToken;

        if (currentTokenIs(this.parser, TokenType.KEYWORD) && token.value === "NOT") {
            return this.parseUnary("NOT");
        }

        if (currentTokenIs(this.parser, TokenType.OPERATOR) && token.value === "-") {
            return this.parseUnary("-");
        }

        return this.parsePostfix();
    }

    private parseUnary(operator: string): UnaryExpression | null {
        this.parser.nextToken();
        const argument = this.parseUnaryExpression();
        return argument ? { type: NodeType.UnaryExpression, operator, argument } : null;
    }

    private parsePostfix(): Expression | null {
        let expression = this.parsePrimary();
        if (!expression) return null;

        while (peekTokenIs(this.parser, TokenType.LBRACKET) || peekTokenIs(this.parser, TokenType.DOT)) {
            expression = peekTokenIs(this.parser, TokenType.LBRACKET)
                ? this.parseIndexExpression(expression)
                : this.parseMemberExpression(expression);

            if (!expression) return null;
        }

        return expression;
    }

    private parseIndexExpression(object: Expression): IndexExpression | null {
        this.parser.nextToken();
        this.parser.nextToken();

        const index = this.parseOrExpression();
        if (!index) return null;

        this.consumeIfPeek(TokenType.RBRACKET);
        return { type: NodeType.IndexExpression, object, index };
    }

    private parseMemberExpression(object: Expression): MemberExpression | null {
        this.parser.nextToken();
        if (!peekTokenIs(this.parser, TokenType.IDENTIFIER)) return null;

        this.parser.nextToken();
        return { type: NodeType.MemberExpression, object, property: this.parser.currentToken.value };
    }

    private parsePrimary(): Expression | null {
        const { currentToken } = this.parser;

        if (currentTokenIs(this.parser, TokenType.LPAREN)) return this.parseGroupedExpression();
        if (currentTokenIs(this.parser, TokenType.LBRACE)) return this.parseObjectLiteral();
        if (currentTokenIs(this.parser, TokenType.LBRACKET)) return this.parseArrayLiteral();

        if (currentTokenIs(this.parser, TokenType.KEYWORD) && currentToken.value === "TRUE") {
            return { type: NodeType.BooleanLiteral, value: true } as BooleanLiteral;
        }

        if (currentTokenIs(this.parser, TokenType.KEYWORD) && currentToken.value === "FALSE") {
            return { type: NodeType.BooleanLiteral, value: false } as BooleanLiteral;
        }

        if (currentTokenIs(this.parser, TokenType.IDENTIFIER)) {
            return this.parseIdentifierOrBuiltInCall(currentToken.value);
        }

        if (currentTokenIs(this.parser, TokenType.NUMBER)) {
            return { type: NodeType.NumberLiteral, value: parseFloat(currentToken.value) };
        }

        if (currentTokenIs(this.parser, TokenType.STRING)) {
            return { type: NodeType.StringLiteral, value: currentToken.value };
        }

        return null;
    }

    private parseGroupedExpression(): Expression | null {
        this.parser.nextToken();
        const innerExpression = this.parseOrExpression();
        if (!innerExpression) return null;

        this.consumeIfPeek(TokenType.RPAREN);
        return innerExpression;
    }

    private parseIdentifierOrBuiltInCall(name: string): Expression | null {
        const normalizedName = name.toUpperCase();

        if (BUILTIN_FUNCTION_NAMES.has(normalizedName) && peekTokenIs(this.parser, TokenType.LPAREN)) {
            return this.parseFunctionCallExpression(normalizedName);
        }

        return { type: NodeType.Identifier, value: name };
    }

    private parseFunctionCallExpression(name: string): FunctionCallExpression {
        this.parser.nextToken();

        return {
            type: NodeType.FunctionCallExpression,
            name,
            args: this.parseDelimitedExpressions(TokenType.RPAREN),
        };
    }

    private parseArrayLiteral(): ArrayLiteral {
        return {
            type: NodeType.ArrayLiteral,
            elements: this.parseDelimitedExpressions(TokenType.RBRACKET, "array literals"),
        };
    }

    private parseDelimitedExpressions(closeToken: TokenType, label = "argument lists"): Expression[] {
        const expressions: Expression[] = [];

        if (this.consumeIfPeek(closeToken)) return expressions;

        this.parser.nextToken();
        const firstExpression = this.parseOrExpression();
        if (firstExpression) expressions.push(firstExpression);

        while (peekTokenIs(this.parser, TokenType.COMMA)) {
            this.parser.nextToken();
            this.parser.nextToken();

            const expression = this.parseOrExpression();
            if (expression) expressions.push(expression);

            this.assertCollectionSize(expressions.length, label);
        }

        this.consumeIfPeek(closeToken);
        return expressions;
    }

    private parseObjectLiteral(): ObjectLiteral {
        const properties: ObjectProperty[] = [];
        if (this.consumeIfPeek(TokenType.RBRACE)) return { type: NodeType.ObjectLiteral, properties };

        const firstProperty = this.parseObjectProperty();
        if (firstProperty) properties.push(firstProperty);

        while (peekTokenIs(this.parser, TokenType.COMMA)) {
            this.parser.nextToken();
            const property = this.parseObjectProperty();
            if (property) properties.push(property);

            this.assertCollectionSize(properties.length, "dictionary literals");
        }

        this.consumeIfPeek(TokenType.RBRACE);
        return { type: NodeType.ObjectLiteral, properties };
    }

    private parseObjectProperty(): ObjectProperty | null {
        this.parser.nextToken();

        if (!currentTokenIs(this.parser, TokenType.IDENTIFIER) && !currentTokenIs(this.parser, TokenType.STRING)) {
            return null;
        }

        const key = this.parser.currentToken.value;
        if (FORBIDDEN_OBJECT_KEYS.has(key)) {
            throw new Error(`Forbidden AliScript dictionary key: ${key}`);
        }

        if (!peekTokenIs(this.parser, TokenType.COLON)) return null;

        this.parser.nextToken();
        this.parser.nextToken();

        const value = this.parseOrExpression();
        return value ? { key, value } : null;
    }

    private peekOperatorIs(operators: ReadonlySet<string>): boolean {
        return peekTokenIs(this.parser, TokenType.OPERATOR) && operators.has(this.parser.peekToken.value);
    }

    private consumeIfPeek(type: TokenType): boolean {
        if (!peekTokenIs(this.parser, type)) return false;

        this.parser.nextToken();
        return true;
    }

    private assertCollectionSize(size: number, label: string): void {
        if (size > MAX_LITERAL_COLLECTION_ELEMENTS) {
            throw new Error(`AliScript ${label} are capped at ${MAX_LITERAL_COLLECTION_ELEMENTS} elements`);
        }
    }
}