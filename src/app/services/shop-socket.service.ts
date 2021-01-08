import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from '../app.component';

export class ShopSocketService {
    webSocketEndPoint: string = 'http://localhost:8091/ws';
    topic: string = "/topic/shops";
    stompClient: any;
    appComponent: AppComponent;

    constructor(appComponent: AppComponent){
        this.appComponent = appComponent;
    }

    _connect() {
        console.log("Initialize ShopSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            _this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

    onMessageReceived(message) {
        // console.log("-----Shop Recived ----------- " + JSON.stringify(message.body));
        this.appComponent.shopSocketMessage(JSON.stringify(message.body));
    }
}