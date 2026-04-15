export enum TokenType {
  IDENTIFIER = "IDENTIFIER",
  NUMBER = "NUMBER",
  OPERATOR = "OPERATOR",
  KEYWORD = "KEYWORD",
  STRING = "STRING",
  EOF = "EOF",
  ASSIGN = "ASSIGN",
  COMMA = "COMMA",
  COLON = "COLON",
}

export interface Token {
  type: TokenType;
  value: string;
}
