import { Service } from 'typedi';
import * as mongoose from 'mongoose';


const scriptSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const ScriptModel = mongoose.model('scripts', scriptSchema);

@Service()
export class ScriptService {
  public getScripts(): any {
    return ScriptModel.find({});
  }
}
