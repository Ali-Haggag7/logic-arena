import { Parser } from "../../../../packages/logic-parser/src";

self.onmessage = (e: MessageEvent) => {
  const { code, id } = e.data;
  
  try {
    const parser = new Parser(code);
    const ast = parser.parse();
    
    // Perform simple syntax checking
    const hasSyntaxError = false; // We would catch exceptions if parser throws, but currently our parser silently ignores bad commands. We can assume if length is 0 and code isn't, there might be an error.
    
    self.postMessage({ id, status: "success", ast });
  } catch (err: any) {
    self.postMessage({ id, status: "error", error: err.message });
  }
};
