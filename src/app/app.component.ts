import { Component, OnInit } from '@angular/core';
import { WebSocketAPI } from './WebSocketAPI';
import { LocationService } from './services/location.service';
import { ShopSocketService } from './services/shop-socket.service';

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

  webSocketAPI: WebSocketAPI;
  shopSocketService: ShopSocketService;
  message: any;
  name: string;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(this);
    this.shopSocketService = new ShopSocketService(this);
    this.connect()
   
   this.locationService.location.subscribe(item => {
   })
  }

  connect() {
    this.webSocketAPI._connect();
    this.shopSocketService._connect();
  }

  disconnect() {
    this.webSocketAPI._disconnect();
    this.shopSocketService._disconnect();
  }

  sendMessage() {
    this.webSocketAPI._send(this.name);
  }

  // Метод обрабатывающий пришедшее сообщение
  public handleMessage = (message) => {
    this.message = JSON.parse(message);

    // Меняем обсервеблы на которые подписан dashboard
    let lastOrder = JSON.parse(this.message);

    // Получаем из меседжа массив маршрута и делаем из него массив координат
    let orderPath: google.maps.LatLng[];
    orderPath = lastOrder.path.map((item) => {
        return  new google.maps.LatLng(item.lat, item.lng)
    })

    // Сохраняем в переменную на сервисе
    this.locationService.orderPath = orderPath;

    // В сервисе только координаты последнего заказа
    this.locationService.lastOrder.next({lng: lastOrder.latlng.lng, lat: lastOrder.latlng.lat});
  }

  // Метод обрабатывающий пришедшее сообщение
  public shopSocketMessage = (message) => {
    let shops = JSON.parse(message);

    // Меняем обсервеблы на которые подписан dashboard
    let shopsArray = JSON.parse(shops);
    console.log('Shops array', shopsArray);
    // Получаем из меседжа массив маршрута и делаем из него массив координат
    // let orderPath: google.maps.LatLng[];
    // orderPath = lastOrder.path.map((item) => {
    //     return  new google.maps.LatLng(item.lat, item.lng)
    // })

    // Сохраняем в переменную на сервисе
    // this.locationService.orderPath = orderPath;

    // В сервисе только координаты последнего заказа
    if (this.shopsArray.length !== shopsArray.length) {
      this.shopsArray = shopsArray;
      this.locationService.shopsArray.next(shopsArray);
    }
    
  }
}
