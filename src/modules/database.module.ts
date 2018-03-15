import { MicroframeworkSettings, MicroframeworkLoader } from 'microframework-w3tec';
import * as mongoose from 'mongoose';

export const databaseModule: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {

  (mongoose as any).Promise = Promise;
  mongoose.connect('mongodb://localhost:27017/amyca', {
    useMongoClient: true,
  }).then(() => {
    console.log('Connected to DB');
  },
    (error) => {
      console.log(`Error Connecting to DB: ${error}`);
  });

};
