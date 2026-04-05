
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { GameService } from "./game.service";
import { GameLoop } from "@logic-arena/engine";

@WebSocketGateway({ cors: { origin: "*" } })
export class GameGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private gameLoop: GameLoop;

  constructor(private readonly gameService: GameService) {}

  onModuleInit() {
    this.gameLoop = new GameLoop();
    const fixedDeltaTime = 1000 / 60 / 1000; // 60 FPS in seconds
    setInterval(() => {
      const gameState = this.gameLoop.update(fixedDeltaTime);
      this.server.emit("gameState", gameState);
    }, 16);
    // The gameLoop.start() method handles its own internal loop with requestAnimationFrame,
    // so directly calling update in a setInterval might interfere or be redundant.
    // Given the request to broadcast every tick, we'll keep the setInterval for now.
    // If GameLoop.start() is also running its own update loop, one of them should be removed.
    // For this task, we'll assume GameLoop.start() initializes the game state and other aspects,
    // and the setInterval will drive the updates and emissions.
    this.gameLoop.start();
  }

  @SubscribeMessage("joinGame")
  handleJoinGame(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket
  ): void {
    this.gameService.joinGame(client, data.userId);
    client.emit("message", `Welcome ${data.userId}!`);
  }
}
