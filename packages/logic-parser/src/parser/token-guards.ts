import { TokenType } from "../types";
import type { Parser } from "./parser";

export function currentTokenIs(parser: Parser, type: TokenType): boolean {
    return (parser.currentToken.type as TokenType) === type;
}

export function peekTokenIs(parser: Parser, type: TokenType): boolean {
    return (parser.peekToken.type as TokenType) === type;
}