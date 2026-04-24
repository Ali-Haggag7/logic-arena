export const KEYWORDS = new Set([
  "IF", "THEN", "ELSE", "END",
  "WHILE", "DO", 
  "FUNCTION", "CALL",
  "FIRE", "BURST_FIRE",
  "MOVE", "MOVE_FAST", "STOP", "BACKUP",
  "PATHFIND", "SET",
  "NOT", "AND", "OR",
  "TRUE", "FALSE",
  "WAIT", "SCAN"
]);

export function isKeyword(value: string): boolean {
  return KEYWORDS.has(value.toUpperCase());
}
