import { Application } from 'express';
import * as Session from 'express-session';
import { createExpressServer } from 'routing-controllers';
import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import { join } from 'path';


export const expressModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {

    /**
     * We create a new express server instance.
     */

    const app: Application = createExpressServer({
      cors: true,
      classTransformer: true,

      // Here Add Controllers for our Express Server.
      controllers: [join(__dirname, '..', 'app/controllers/route/*.controller{.js,.ts}')],
    });

    // Setting Session for Express and Socket
    const sessionSetting = {
      store: settings.getData('cacheStore'), // session.MemoryStore or Add Redis Once ready
      secret: 'your secret',
      cookie: { path: '/', httpOnly: true, secure: true, maxAge: undefined },
      resave: true,
      saveUninitialized: true,
    };

    // Use Session Middleware
    app.use(Session(sessionSetting));

    // Run application to listen on given port
    const server = app.listen(4200);

    console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB on Intializing Express`);


    // set the data for other Modules
    settings.setData('server', server);
    settings.setData('sessionSetting', sessionSetting);
    // settings.setData('app', app);
  }
};
