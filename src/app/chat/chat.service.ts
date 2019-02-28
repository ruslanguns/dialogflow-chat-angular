import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';

import { BehaviorSubject } from 'rxjs';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';



export class Message {
  constructor(
    public content: string, public sendBy: string
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogflow.WifiSocial;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // talk() {
  //   this.client.textRequest('¿Quién eres?')
  //       .then( res => console.log( res ));
  // }

  // Adds message to source
  update( msg: Message ) {
    this.conversation.next([ msg ]);
  }

  // Sends and receives messages via DiagFlow
  converse( msg: string ) {
    const userMessage = new Message( msg, 'user');
    this.update( userMessage );

    return this.client.textRequest( msg )
                .then( res => {
                  console.log( res );
                  const speech = res.result.fulfillment.speech;
                  const botMessage = new Message(speech, 'bot');
                  this.update( botMessage );
                });
  }
}
