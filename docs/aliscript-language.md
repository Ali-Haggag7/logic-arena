# AliScript Language Reference (v2.0 Fox Mind Update)

## Overview
AliScript is a simple, line-based scripting language specifically designed for programming combat robots within the Logic Arena environment. The v2.0 update introduces block-based execution, variables, neural pathways (functions), and mathematical operators.

## Syntax Rules
- **Block Formatting**: Conditionals and loops require explicit block keywords (`THEN`, `DO`) and must be terminated with `END`.
- **Case Insensitive**: Keywords can be written in uppercase or lowercase.
- **Comments**: Use `//` to add comments.

## Commands Reference

### Structural Flow
- `IF [condition] THEN ... ELSE ... END`: Branching conditionals.
- `WHILE [condition] DO ... END`: Loops over a block of code (Max 10 iterations/tick limit applied automatically).
- `FUNCTION [name] ... END` and `CALL [name]`: Define and invoke modular routines.

### Movement & Haptic Constraints
- `MOVE`: Moves the robot forward.
- `MOVE_FAST`: 2x standard speed, drains extra energy.
- `BACKUP`: Retreats from the facing angle.
- `STOP`: Halts all movement.
- `PATHFIND`: Computes A* navigation to the nearest enemy.
- `WAIT [ticks]`: Suspends code execution for the defined cycles (60 ticks = 1 second).

### Sensors & Combat
- `SCAN`: Populates `scanned_distance`, `scanned_angle`, and `scanned_spotted` immediately without moving the bot.
- `FIRE`: Standard projectile (500ms cooldown).
- `BURST_FIRE`: Rapid multi-fire variant.

### Math & Logic
Operators `+`, `-`, `*`, `/`, `%` are supported in calculations.
- `SET [var] = expression`: Defines memory allocation. Example: `SET limit = 10 % 3`
- `NOT`: Inverts a boolean condition. Example: `IF NOT spotted THEN SCAN`

### Memory Interface
ReadOnly Core Variables:
- `health`: Core Integrity (0-100).
- `distance`: Immediate distance to nearest enemy (if visible).
- `spotted`: TRUE if an enemy is in the standard FOV.
- `rotation`: Facing angle in radians.

## Battle Tactics (High-Level Examples)

### 1. The Stalker
Uses a continuous scan loop to acquire targets out of normal range, calculating offsets.
```aliscript
SCAN
WHILE NOT scanned_spotted DO
  SET rotation = rotation + 0.1
  WAIT 2
  SCAN
END
PATHFIND
IF scanned_distance < 200 THEN FIRE
```

### 2. The Turret
Remains stationary, waiting for optimal burst engagements to conserve energy.
```aliscript
FUNCTION defend
  SCAN
  IF scanned_distance < 150 THEN
    BURST_FIRE
    WAIT 10
  ELSE
    SET rotation = rotation + 0.05
  END
END

STOP
WHILE TRUE DO
  CALL defend
END
```

### 3. The Jitterbug
Utilizes math offsets to move erratically, dodging projectiles while maintaining a general forward sweep.
```aliscript
SET offset = 1

WHILE TRUE DO
  MOVE_FAST
  SET rotation = rotation + (offset * 0.5)
  SET offset = offset * -1
  IF spotted THEN FIRE
  WAIT 3
END
```

## Energy System
Each action (movement and firing) consumes energy. Robots regenerate energy passively over time. Complex commands like `BURST_FIRE` and `MOVE_FAST` consume energy at a significantly higher rate.
