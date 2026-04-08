export enum TokenType {
  IDENTIFIER = "IDENTIFIER",
  NUMBER = "NUMBER",
  OPERATOR = "OPERATOR",
  KEYWORD = "KEYWORD",
  STRING = "STRING",
  EOF = "EOF", // End Of File
  ASSIGN = "ASSIGN", // For "SET" keyword
  COMMA = "COMMA", // For separating arguments
  COLON = "COLON", // For separating arguments
}

export interface Token {
  type: TokenType;
  value: string;
}

export enum NodeType {
  Program = "Program",
  IfStatement = "IfStatement",
  ComparisonExpression = "ComparisonExpression",
  ActionExpression = "ActionExpression",
  Identifier = "Identifier",
  NumberLiteral = "NumberLiteral",
  StringLiteral = "StringLiteral",
  AssignmentStatement = "AssignmentStatement",
}

export type Expression = Identifier | NumberLiteral | StringLiteral | ComparisonExpression | ActionExpression;

export interface BaseNode {
  type: NodeType;
}

export interface Statement extends BaseNode {
}

export interface AssignmentStatement extends Statement {
  type: NodeType.AssignmentStatement;
  name: Identifier;
  value: Identifier | NumberLiteral | StringLiteral;
}

export interface Program extends Statement {
  type: NodeType.Program;
  body: Statement[];
}

export interface IfStatement extends Statement {
  type: NodeType.IfStatement;
  condition: ComparisonExpression;
  consequence: ActionExpression;
}

export interface ComparisonExpression extends BaseNode {
  type: NodeType.ComparisonExpression;
  left: Identifier | NumberLiteral;
  operator: string;
  right: Identifier | NumberLiteral;
}

export interface ActionExpression extends BaseNode {
  type: NodeType.ActionExpression;
  command: string;
  args?: (Identifier | NumberLiteral | StringLiteral)[];
}

export interface Identifier extends BaseNode {
  type: NodeType.Identifier;
  value: string;
}

export interface NumberLiteral extends BaseNode {
  type: NodeType.NumberLiteral;
  value: number;
}

export interface StringLiteral extends BaseNode {
  type: NodeType.StringLiteral;
  value: string;
}
