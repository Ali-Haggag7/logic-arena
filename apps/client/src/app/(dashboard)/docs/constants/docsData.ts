export interface CommandDoc {
  command: string;
  category: string;
  parameters: string;
  description: string;
  example: string;
}

export const COMMAND_TABLE: CommandDoc[] = [
  { command: "IF...THEN...ELSE...END", category: "Control Flow", parameters: "condition", description: "Branching logic with optional else clause. Must be closed with END.", example: "IF health < 50 THEN BACKUP ELSE FIRE END" },
  { command: "WHILE...DO...END", category: "Control Flow", parameters: "condition", description: "Looping logic. Executes block while condition is true. Auto-capped at 10 iter/tick.", example: "WHILE spotted DO FIRE WAIT 1 END" },
  { command: "FUNCTION / CALL", category: "Control Flow", parameters: "name", description: "Define reusable neural pathways (functions) and invoke them.", example: "FUNCTION retreat BACKUP END CALL retreat" },
  { command: "MOVE / MOVE_FAST", category: "Movement", parameters: "—", description: "Standard and high-speed forward propulsion.", example: "MOVE_FAST" },
  { command: "PATHFIND", category: "Movement", parameters: "—", description: "A* pathfinding towards nearest target while avoiding obstacles.", example: "PATHFIND" },
  { command: "SCAN", category: "Sensors", parameters: "—", description: "Instant sensor ping. Populates scanned_distance, scanned_angle, scanned_spotted.", example: "SCAN" },
  { command: "WAIT", category: "Sensors", parameters: "N: ticks", description: "Suspends code execution for N ticks. 60 ticks = 1 second.", example: "WAIT 30" },
  { command: "FIRE / BURST_FIRE", category: "Attack", parameters: "—", description: "Discharge weapons. Burst fire consumes significantly more energy.", example: "BURST_FIRE" },
  { command: "SET var = expr", category: "Intelligence", parameters: "expression", description: "Assign values using math operators (+, -, *, /, %).", example: "SET rotation = rotation + (0.1 * precision)" },
  { command: "NOT / TRUE / FALSE", category: "Intelligence", parameters: "booleans", description: "Logical operators and boolean constants for advanced conditions.", example: "IF NOT spotted THEN SCAN" },
];

export const QUICK_REF = [
  { title: "CONTROL FLOW", icon: "⬡", color: "#f59e0b", commands: ["IF...ELSE", "WHILE...DO", "FUNCTION", "CALL", "END"] },
  { title: "SENSORS", icon: "◈", color: "#22d3ee", commands: ["SCAN", "WAIT", "health", "distance", "spotted"] },
  { title: "INTELLIGENCE", icon: "◉", color: "#a855f7", commands: ["SET var = val", "Math (+, -, *, /, %)", "Logic (NOT, TRUE, FALSE)", "rotation"] },
];

export const SAMPLE_SCRIPT = `// The Stalker v2.0
SCAN
WHILE NOT scanned_spotted DO
  SET rotation = rotation + 0.1
  WAIT 2
  SCAN
END

IF scanned_distance < 250 THEN
  BURST_FIRE
ELSE
  PATHFIND
END`;

export const CATEGORY_COLORS: Record<string, string> = {
  "Control Flow": "#f59e0b",
  Movement: "#22d3ee",
  Sensors: "#06b6d4",
  Attack: "#f97316",
  Tactics: "#facc15",
  "Advanced Combat": "#ef4444",
  Evasion: "#22c55e",
  Intelligence: "#a855f7",
};

export const TACTICS_DATA = [
  { title: "THE STALKER", desc: "Sensor-loop logic for hyper-accurate target acquisition.", code: "// Adaptive Scan Loop\nSCAN\nWHILE NOT scanned_spotted DO\n  SET rotation = rotation + 0.1\n  WAIT 2\n  SCAN\nEND\nPATHFIND", color: "#22d3ee" },
  { title: "THE TURRET", desc: "Energy-efficient static defense with manual rotation.", code: "FUNCTION defend\n  SCAN\n  IF scanned_distance < 150 THEN\n    BURST_FIRE\n    WAIT 10\n  ELSE\n    SET rotation = rotation + 0.05\n  END\nEND\nSTOP\nWHILE TRUE DO CALL defend END", color: "#f97316" },
  { title: "THE JITTERBUG", desc: "Chaotic movement offsets to bypass enemy trajectory prediction.", code: "SET offset = 1\nWHILE TRUE DO\n  MOVE_FAST\n  SET rotation = rotation + (offset * 0.5)\n  SET offset = offset * -1\n  IF spotted THEN FIRE\n  WAIT 3\nEND", color: "#a855f7" }
];
