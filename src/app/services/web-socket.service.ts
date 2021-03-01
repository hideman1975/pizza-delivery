import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from '../app.component';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class WebSocketService {

webSocket: WebSocket;
shopWebSocket: WebSocket;

public routePath = new Subject<any>();
public shopsArray = new Subject<any>();

constructor() {
    this.webSocket = new WebSocket(environment.wsUrl + '/chat');
    this.shopWebSocket = new WebSocket(environment.wsUrl + '/shop');
}

public openWebSocket() {
    this.webSocket.onopen = (event) => {
        console.log('Open:', event);
    }

    this.webSocket.onmessage = (event) => {
        const pathArray = JSON.parse(event.data)
        this.routePath.next(pathArray);
    }

    this.webSocket.onclose = (event) => {
        console.log('Close:', event);
    };
}

public openShopWebSocket() {
    this.shopWebSocket.onopen = (event) => {
        console.log('Open Shop:', event);
    }

    this.shopWebSocket.onmessage = (event) => {
        const shopsArray = JSON.parse(event.data)
         console.log('Shop Message Recived:', shopsArray);
         this.shopsArray.next(shopsArray);
    }

    this.shopWebSocket.onclose = (event) => {
        console.log('Close Shop:', event);
    };
}

public sendMessage(message) {
    this.webSocket.send(JSON.stringify(message));
    console.log('Message Sent:', message);
}

public closeWebSocket() {
    console.log('Service: Close Socket:');
    this.webSocket.close();
    this.shopWebSocket.close();
}
    
}