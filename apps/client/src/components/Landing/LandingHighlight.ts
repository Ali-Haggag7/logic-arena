import { aliScriptExample } from "./LandingConstants";

export function highlightAliScript(code: string): { __html: string } {
  const keywordPattern =
    /\b(WHILE|IF|ELSE|DO|END|AND|OR|NOT|TRUE|FALSE|IN_STASIS|MY_ENERGY|CAN_SEE_ENEMY|NEAREST_VISIBLE_X)\b/g;
  const commandPattern = /\b(FIRE|SCAN|PATHFIND|WAIT|BROADCAST)\b/g;

  const lines = code.split("\n");
  const highlighted = lines.map((line, lineIdx) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("//")) {
      return `<span class="text-text-secondary/60">${line}</span>`;
    }
    const escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    let result = escaped;
    result = result.replace(commandPattern, '<span class="text-text-primary font-semibold">$1</span>');
    result = result.replace(keywordPattern, '<span class="text-accent font-bold">$1</span>');

    const lineNum = String(lineIdx + 1).padStart(2, " ");
    return `<span class="text-text-secondary/30 select-none">${lineNum}</span>  ${result}`;
  });

  return { __html: highlighted.join("\n") };
}

export const HIGHLIGHTED_EXAMPLE = highlightAliScript(aliScriptExample);
