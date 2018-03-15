import { SocketController, OnConnect, ConnectedSocket, SocketIO } from 'socket-controllers';

@SocketController()
export class MessageController {

  @OnConnect()
  protected connection(@ConnectedSocket() socket: any, @SocketIO() io: any): void {
    // console.log(socket.id);
    io.clients((error, clients) => {
      if (error) { throw error; }
      // console.log(clients);
    });
  }

}
