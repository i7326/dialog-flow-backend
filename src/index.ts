/**
 * AmYcA Backend - Express, Socket.io
 * ----------------------------------------
 *
 * This is the entry file of the Application.
 * The basic layer of this app is express. We are using microframework for loading our express application.
 * 'README.md' file will provide more information.
 */

import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { expressModule } from './modules/express.module';
import { socketModule } from './modules/socket.module';
import { cacheModule } from './modules/cache.module';
import { databaseModule } from './modules/database.module';

bootstrapMicroframework({
  /**
   * Loader is a place where you can configure all your modules during microframework
   * bootstrap process. All loaders are executed one by one in a sequential order.
   */
  loaders: [
    cacheModule,
    expressModule,
    socketModule,
    // databaseModule,
  ],
}).then(() => {
  console.log('Running');
}).catch(error => console.log('Application is crashed: ' + error));
