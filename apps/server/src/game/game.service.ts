import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameLoop, Robot } from "@logic-arena/engine";

@Injectable()
export class GameService {
  private connectedClients: Map<string, Socket> = new Map();
  private gameLoop: GameLoop;

  constructor() {
    this.gameLoop = new GameLoop();

    this.gameLoop.addRobot({
      id: "bot-1",
      position: { x: 100, y: 100 },
      velocity: { x: 2, y: 1.5 },
      color: "#00FFFF",
    } as Robot);

    this.gameLoop.addRobot({
      id: "bot-2",
      position: { x: 400, y: 300 },
      velocity: { x: -1.5, y: 2 },
      color: "#FF00FF",
    } as Robot);

    // Start the engine logic
    this.gameLoop.start();
  }

  getGameLoop(): GameLoop {
    return this.gameLoop;
  }

  getGameState(): Robot[] {
    return this.gameLoop.getRobots();
  }

  joinGame(client: Socket, userId: string): void {
    this.connectedClients.set(userId, client);
    console.log(`Client ${userId} connected.`);

    client.on("disconnect", () => {
      this.connectedClients.delete(userId);
      console.log(`Client ${userId} disconnected.`);
    });
  }
}