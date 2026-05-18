import { assertAliScriptCollectionCanGrow } from '@logic-arena/engine';
import { UNHANDLED } from './internal';

export function evaluateArrayFunction(name: string, args: unknown[]): unknown {
  const a = args[0];

  switch (name) {
    case 'LENGTH': {
      if (Array.isArray(a)) return a.length;
      if (typeof a === 'string') return a.length;
      return 0;
    }

    case 'PUSH': {
      if (Array.isArray(a)) {
        assertAliScriptCollectionCanGrow(a.length);
        a.push(args[1]);
        return a.length;
      }
      return 0;
    }

    case 'POP': {
      if (Array.isArray(a) && a.length > 0) {
        return a.pop();
      }
      return undefined;
    }

    default:
      return UNHANDLED;
  }
}
