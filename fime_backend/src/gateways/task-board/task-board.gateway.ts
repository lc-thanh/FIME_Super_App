import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class TaskBoardGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor() {}

  afterInit() {
    console.log('WebSocket server initialized!');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-workspace')
  async handleJoinWorkspace(
    @MessageBody() workspaceId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(`workspace-${workspaceId}`); // vào phòng riêng
    console.log(`Client ${client.id} joined workspace-${workspaceId}`);
  }
}
