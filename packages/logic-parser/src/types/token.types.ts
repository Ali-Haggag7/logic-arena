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
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
}

export interface Token {
  type: TokenType;
  value: string;
}
