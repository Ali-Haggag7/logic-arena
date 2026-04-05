
import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";

@Injectable()
export class GameService {
  private connectedClients: Map<string, Socket> = new Map();

  joinGame(client: Socket, userId: string): void {
    this.connectedClients.set(userId, client);
    console.log(`Client ${userId} connected.`);

    client.on("disconnect", () => {
      this.connectedClients.delete(userId);
      console.log(`Client ${userId} disconnected.`);
    });
  }

  // Other game-related methods can be added here
}
