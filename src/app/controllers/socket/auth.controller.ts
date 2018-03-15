import { SocketController, OnConnect, ConnectedSocket, SocketIO, OnDisconnect } from 'socket-controllers';

@SocketController()
export class AuthController {

  @OnConnect()
  protected connection(@ConnectedSocket() socket: any, @SocketIO() io: any): void {
    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB on connecting ${socket.id}`);
  }

  @OnDisconnect()
  protected disconnection(@ConnectedSocket() socket: any): void {
    setTimeout(() => {
      console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB on disconnecting ${socket.id}`);
    }, 5000);

  }

}
