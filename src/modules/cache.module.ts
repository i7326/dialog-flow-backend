import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import * as redis from 'redis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';

export const cacheModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const cacheClient = redis.createClient({ host: 'localhost', port: 6379 });
    const RedisStore = connectRedis(session);
    const cacheStore = new RedisStore({
      client: cacheClient,
    });
    settings.setData('cacheStore', cacheStore);
  }
};
