import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class DashboardGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('exerciseLogChange')
  handleExerciseLog(): void {
    this.server.emit('exerciseLogChange');
  }
}
