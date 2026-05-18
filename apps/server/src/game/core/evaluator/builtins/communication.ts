import {
  Robot,
  ALISCRIPT_MAX_COLLECTION_ELEMENTS,
  assertAliScriptCollectionCanGrow,
} from '@logic-arena/engine';
import { UNHANDLED } from './internal';

const INBOX_KEY = '___INBOX';

export function evaluateCommunicationFunction(
  name: string,
  args: unknown[],
  memory: Record<string, unknown>,
  robot: Robot,
  getRobots: () => Robot[],
): unknown {
  switch (name) {
    case 'BROADCAST': {
      const payload = args[0];
      if (payload === undefined) return 0;

      const allRobots = getRobots();
      let broadcastCount = 0;

      for (const ally of allRobots) {
        if (ally.team !== robot.team || !ally.isAlive) continue;
        const safePayload = JSON.parse(JSON.stringify(payload));
        const allyMemory = ally.memory;
        if (!Array.isArray(allyMemory[INBOX_KEY])) {
          allyMemory[INBOX_KEY] = [];
        }
        assertAliScriptCollectionCanGrow(
          (allyMemory[INBOX_KEY] as unknown[]).length,
        );
        (allyMemory[INBOX_KEY] as unknown[]).push(safePayload);
        broadcastCount++;
      }

      return broadcastCount;
    }

    case 'RECEIVE': {
      const inbox = memory[INBOX_KEY];
      if (!Array.isArray(inbox) || inbox.length === 0) return [];
      const drained = inbox.slice(0, ALISCRIPT_MAX_COLLECTION_ELEMENTS);
      memory[INBOX_KEY] = [];
      return drained;
    }

    default:
      return UNHANDLED;
  }
}
