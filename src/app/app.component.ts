import { Component, OnInit } from '@angular/core';
// import { WebSocketAPI } from './WebSocketAPI';
// import { LocationService } from './services/location.service';
// import { ShopSocketService } from './services/shop-socket.service';
// import { WebSocketService } from '../app/services/web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'taxi-front';
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  private shopsArray = [];

  //webSocketAPI: WebSocketAPI;
  //shopSocketService: ShopSocketService;
  message: any;
  name: string;

  // constructor(private locationService: LocationService) {}
  constructor()
     {
    // this.webSocketService.openWebSocket();
    // this.webSocketService.openShopWebSocket();
  }

  // public sendMessage() {
  //   console.log('Send Message')
  //   this.webSocketService.sendMessage('Hello Simple Socket')
  // }

  ngOnInit() {
    // this.webSocketService.routePath.subscribe(item => {
    //   console.log('New Path', item);
    //   this.handleMessage(item)
    // })
  }

  // ngOnInit() {
  //   this.webSocketAPI = new WebSocketAPI(this);
  //   this.shopSocketService = new ShopSocketService(this);
  //   this.connect()
   
  //  this.locationService.location.subscribe(item => {
  //  })
  // }

  // connect() {
  //   this.webSocketAPI._connect();
  //   this.shopSocketService._connect();
  // }

  // disconnect() {
  //   this.webSocketAPI._disconnect();
  //   this.shopSocketService._disconnect();
  // }

  // sendMessage() {
  //   this.webSocketAPI._send(this.name);
  // }

  // Метод обрабатывающий пришедшее сообщение
  // public handleMessage = (message) => {
  //   //this.message = JSON.parse(message);

  //   // Меняем обсервеблы на которые подписан dashboard
  //   //let lastOrder = JSON.parse(this.message);
  //   let lastOrder = message;

  //   // Получаем из меседжа массив маршрута и делаем из него массив координат
  //   let orderPath: google.maps.LatLng[];
  //   orderPath = lastOrder.order_path.map((item) => {
  //       return  new google.maps.LatLng(item.lat, item.lng)
  //   })

  // //   // Сохраняем в переменную на сервисе
  //   this.locationService.orderPath = orderPath;

  //   // В сервисе только координаты последнего заказа
  //   // this.locationService.lastOrder.next({lng: lastOrder.latlng.lng, lat: lastOrder.latlng.lat});
  //   let length = lastOrder.order_path.length - 1;
  //   this.locationService.lastOrder.next({lng: lastOrder.order_path[length].lng, lat: lastOrder.order_path[length].lat});
  // }

  // Метод обрабатывающий пришедшее сообщение
  // public shopSocketMessage = (message) => {
  //   let shops = JSON.parse(message);

  //   // Меняем обсервеблы на которые подписан dashboard
  //   let shopsArray = JSON.parse(shops);
  //   console.log('Shops array', shopsArray);
  //   // Получаем из меседжа массив маршрута и делаем из него массив координат
  //   // let orderPath: google.maps.LatLng[];
  //   // orderPath = lastOrder.path.map((item) => {
  //   //     return  new google.maps.LatLng(item.lat, item.lng)
  //   // })

  //   // Сохраняем в переменную на сервисе
  //   // this.locationService.orderPath = orderPath;

  //   // В сервисе только координаты последнего заказа
  //   if (this.shopsArray.length !== shopsArray.length) {
  //     this.shopsArray = shopsArray;
  //     this.locationService.shopsArray.next(shopsArray);
  //   }
    
  // }
}
