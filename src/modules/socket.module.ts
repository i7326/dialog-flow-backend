import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { useSocketServer, useContainer } from 'socket-controllers';
import * as io from 'socket.io';
import * as socketIOSession from 'socket.io.session';
import { join } from 'path';
import { Container } from 'typedi';



export const socketModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB Before Creating Socket`);
    const socket = io(settings.getData('server'), {
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: true,
    });
    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB After Creating Socket`);

    // Use Container for Injecting services
    useContainer(Container);
    // Set Socket Session

    const session = socketIOSession(settings.getData('sessionSetting'));
    socket.use(session.parser);

    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB After Creating Socket Session`);

    useSocketServer(socket, {

      // Here Add Controllers for our Socket Server.
      controllers: [join(__dirname, '..', 'app/controllers/socket/*.controller{.js,.ts}')],

    });

    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB After Using Socket Controller`);
  }
};
