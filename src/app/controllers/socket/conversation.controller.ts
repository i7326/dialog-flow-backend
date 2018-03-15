import { SocketController, OnConnect, ConnectedSocket, SocketIO, OnMessage, EmitOnSuccess, MessageBody } from 'socket-controllers';
import { ConversationService } from '../../services/conversation.service';

@SocketController()
export class ConversationController {
  constructor(private conversationService: ConversationService) {

  }

  @OnConnect()
  protected connection(@ConnectedSocket() socket: any, @SocketIO() io: any): void {
    // console.log(socket.id);
    io.clients((error, clients) => {
      if (error) { throw error; }
      // console.log(clients);
    });
  }

  @OnMessage('request')
  @EmitOnSuccess('response')
  protected handleConversation( @ConnectedSocket() socket: any, @MessageBody() message: any): any {
    return this.conversationService.textRequest(message.text, socket.id);
    // this.scriptService.getScripts().then(scripts => { console.log(scripts); });
    // let f = () => this.scriptService.getScripts().then(scripts => scripts);
    // setTimeout(() => {console.log(f())}, 5000);
    // let x: any;
    // this.scriptService.getScripts().then(scripts => { x = scripts; });
    // return x;
    // //this.scriptService.getScripts().then(scripts => scripts);
  }

}
