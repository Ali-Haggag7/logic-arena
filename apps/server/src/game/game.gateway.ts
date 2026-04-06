import { WebSocketGateway, WebSocketServer, OnGatewayInit } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GameService } from "./game.service";

@WebSocketGateway({
  cors: { origin: "http://localhost:3000" },
})
export class GameGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) { }

  afterInit(server: Server) {
    console.log("🚀 Gateway is LIVE. Starting Real-time Broadcast...");

    setInterval(() => {
      const robots = this.gameService.getGameState();

      if (robots.length > 0) {
        server.emit("gameState", robots);
      }
    }, 16); // 60 FPS
  }
}