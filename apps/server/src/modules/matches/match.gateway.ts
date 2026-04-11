import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, WebSocket } from "ws";
import { MatchEngine } from "./match.engine";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
}

@WebSocketGateway({ cors: { origin: "." } })
export class MatchGateway {
  @WebSocketServer()
  server!: Server;

  private matches: Map<string, MatchEngine> = new Map();

  handleConnection(@ConnectedSocket() client: AuthenticatedWebSocket) {
    // In a real application, you would authenticate the WebSocket connection
    // and set client.userId based on a JWT or session.
    // For this phase, we'll simulate a user ID.
    client.userId = `user-${Math.random().toString(36).substring(7)}`;
    console.log(`Client connected: ${client.userId}`);
  }

  handleDisconnect(@ConnectedSocket() client: AuthenticatedWebSocket) {
    console.log(`Client disconnected: ${client.userId}`);
    // Potentially end matches if players disconnect
  }

  @SubscribeMessage("joinMatch")
  handleJoinMatch(@ConnectedSocket() client: AuthenticatedWebSocket, @MessageBody() data: { matchId: string; script: string }) {
    console.log(`Client ${client.userId} joining match ${data.matchId}`);

    let match = this.matches.get(data.matchId);

    if (!match) {
      // For simplicity, let the first player create the match
      // In a real scenario, matches would be created via an API call
      match = new MatchEngine(data.matchId, [{ id: client.userId!, script: data.script }]);
      this.matches.set(data.matchId, match);
      match.start();
      this.broadcastMatchState(data.matchId, match.getState());
    } else {
      // Add player to existing match (basic implementation)
      // In a real game, you would need to add logic to ensure the match is not full
      // or handle different match types (ranked/friendly)
      const playerExists = match.getState().players.some(p => p.id === client.userId);
      if (!playerExists) {
        match.getState().players.push({
          id: client.userId!,
          script: data.script,
          position: { x: Math.random() * 100, y: Math.random() * 100 },
          health: 100,
        });
        this.broadcastMatchState(data.matchId, match.getState());
      }
    }
  }

  // Method to broadcast match state to all clients in a specific match
  private broadcastMatchState(matchId: string, state: any) {
    this.server.clients.forEach(client => {
      const authClient = client as AuthenticatedWebSocket;
      // Only send to clients that are part of this match (needs more robust tracking)
      // For now, assume all connected clients are in the same match
      if (authClient.userId) {
        client.send(JSON.stringify({ event: "matchState", data: state }));
      }
    });
  }
}
