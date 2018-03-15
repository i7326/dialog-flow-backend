import { SocketController, OnMessage, ConnectedSocket, SocketIO, OnConnect, MessageBody, EmitOnSuccess } from 'socket-controllers';
import { join } from 'path';
import { readFileSync } from 'fs';
import { ScriptService } from '../../services/script.service';

@SocketController()
export class ScriptController {
  constructor(private scriptService: ScriptService) { }

  @OnConnect()
  protected connection( @ConnectedSocket() socket: any, @SocketIO() io: any): void {
    io.clients((error, clients) => {
      if (error) { throw error; }
      // console.log(clients);
    });
  }

  @OnMessage('send')
  protected send( @ConnectedSocket() socket: any): void {
    // readFile();
    const ScriptPath = join(__dirname, '..', '..', '..', 'scripts');
    // console.log();
    socket.emit('done', { file: readFileSync(join(ScriptPath, 'cleanup-browser.ps1')), name: 'cleanup-browser.ps1' });
  }

  @OnMessage('get-scripts')
  @EmitOnSuccess('scripts-fetched')
  protected sendScripts( @ConnectedSocket() socket: any, @MessageBody() message: any): any {
    // this.scriptService.getScripts().then(scripts => { console.log(scripts); });
    // let f = () => this.scriptService.getScripts().then(scripts => scripts);
    // setTimeout(() => {console.log(f())}, 5000);
    // let x: any;
    // this.scriptService.getScripts().then(scripts => { x = scripts; });
    // return x;
    // //this.scriptService.getScripts().then(scripts => scripts);
  }


}
