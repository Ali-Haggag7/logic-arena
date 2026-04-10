import { Robot, Obstacle } from "../types";

const ROBOT_RADIUS = 15;

export function checkObstacleCollision(robot: Robot, obstacle: Obstacle): void {
  const now = Date.now();

  const closestX = Math.max(
    obstacle.position.x - obstacle.width / 2,
    Math.min(robot.position.x, obstacle.position.x + obstacle.width / 2)
  );
  const closestY = Math.max(
    obstacle.position.y - obstacle.height / 2,
    Math.min(robot.position.y, obstacle.position.y + obstacle.height / 2)
  );

  const dx = robot.position.x - closestX;
  const dy = robot.position.y - closestY;
  const distance = Math.hypot(dx, dy);

  if (distance < ROBOT_RADIUS) {
    const overlap = ROBOT_RADIUS - distance;
    const angle = Math.atan2(dy, dx);

    switch (obstacle.type) {
      case 'WALL':
        // Push robot out + reflect velocity
        robot.position.x += overlap * Math.cos(angle);
        robot.position.y += overlap * Math.sin(angle);
        if (Math.abs(dx) > Math.abs(dy)) {
          robot.velocity.x *= -1;
        } else {
          robot.velocity.y *= -1;
        }
        break;

      case 'TRAP':
        // Push robot out normally
        robot.position.x += overlap * Math.cos(angle);
        robot.position.y += overlap * Math.sin(angle);

        // FIX: Add a 1500ms immunity window after the trap expires so they can walk away!
        if (!robot.trappedUntil || now > robot.trappedUntil + 1500) {
          robot.health = Math.max(0, robot.health - 10);
          if (robot.health === 0) robot.isAlive = false;
          robot.trappedUntil = now + 5000;
        }
        break;

      case 'SLOW':
        // Push robot out + apply slow
        robot.position.x += overlap * Math.cos(angle);
        robot.position.y += overlap * Math.sin(angle);
        if (!robot.slowedUntil || now >= robot.slowedUntil) {
          robot.slowedUntil = now + 3000;
          robot.speedMultiplier = 0.4;
        }
        break;

      case 'BOUNCER':
        // Push robot out + boost velocity
        robot.position.x += overlap * Math.cos(angle);
        robot.position.y += overlap * Math.sin(angle);
        if (Math.abs(dx) > Math.abs(dy)) {
          robot.velocity.x *= -1.8;
          robot.velocity.y *= 1.8;
        } else {
          robot.velocity.x *= 1.8;
          robot.velocity.y *= -1.8;
        }
        break;
    }
  }
}