import { UNHANDLED } from './internal';

export function evaluateMathFunction(name: string, args: unknown[]): unknown {
  const a = args[0] as number;
  const b = args[1] as number;

  switch (name) {
    case 'ABS':
      return typeof a === 'number' ? Math.abs(a) : 0;
    case 'SQRT':
      return typeof a === 'number' ? Math.sqrt(Math.max(0, a)) : 0;
    case 'SIN':
      return typeof a === 'number' ? Math.sin(a) : 0;
    case 'COS':
      return typeof a === 'number' ? Math.cos(a) : 0;
    case 'TAN':
      return typeof a === 'number' ? Math.tan(a) : 0;
    case 'FLOOR':
      return typeof a === 'number' ? Math.floor(a) : 0;
    case 'CEIL':
      return typeof a === 'number' ? Math.ceil(a) : 0;
    case 'ROUND':
      return typeof a === 'number' ? Math.round(a) : 0;
    case 'LOG':
      return typeof a === 'number' && a > 0 ? Math.log(a) : 0;
    case 'POW':
      return typeof a === 'number' && typeof b === 'number'
        ? Math.pow(a, b)
        : 0;
    case 'ATAN2':
      return typeof a === 'number' && typeof b === 'number'
        ? Math.atan2(a, b)
        : 0;
    case 'MIN':
      return typeof a === 'number' && typeof b === 'number'
        ? Math.min(a, b)
        : 0;
    case 'MAX':
      return typeof a === 'number' && typeof b === 'number'
        ? Math.max(a, b)
        : 0;
    case 'RANDOM':
      return Math.random();
    default:
      return UNHANDLED;
  }
}
