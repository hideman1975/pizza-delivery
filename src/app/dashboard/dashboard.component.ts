import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { VehicleIconService } from '../services/vehicle-icon.service';
import { WebSocketService } from '../services/web-socket.service';
import { LocationService } from '../services/location.service';
import { Vehicle } from '../models/Vehicle';
import { Order } from '../models/Order';
import { Shop } from '../models/Shop';
import { GlobalVariablesService } from '../services/global-variables.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  latitude = null;
  longitude = null;
  zoom = 15;
  address: string;
  lat: any;
  lng: any;


  public googleMap;
  public directionsDisplay = new google.maps.DirectionsRenderer();
  public directionsService = new google.maps.DirectionsService();

  public drawingManager: any;
  public icon;
  public route;
  public myMarker1;
  public myMarker2;
  public myMarker3;
  public myMarker4;
  private routeArray = [];
  private marker;
  public markers = [];
  private nextTrip = true;
  public marker1;
  public marker2;
  public marker3;
  public marker4;
  orderMarker;
  private start;
  public orderDelivered: number = 0;
  public orderList: Order[] = [];
  public vehicleList: Vehicle[] = [];
  public orderCounter: number = 0;
  public orderIndex: number = 0;
  public activeVehicles: number = 20;
  public ordersAwaiting: number = 0;

  public vehicleColors =  {
    '56.309148': '#0075C4',
    '56.29097': '#808000',
    '56.32588': '#6F4E37',
    '56.287713': '#C20C15',
    '56.235213': '#4D4D4D'
  }
  public envName = environment.name;

  // @ViewChild('search')
  // public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private vehicleIconService: VehicleIconService,
    private globalVariablesService: GlobalVariablesService,
    private locationService: LocationService,
    private webSocketService: WebSocketService
  ) { 

    this.webSocketService.openWebSocket();
    this.webSocketService.openShopWebSocket();
  }

  ngOnInit(): void {
    this.start = new google.maps.LatLng(56.32628302868094, 43.957951068878174);
    
    this.mapsAPILoader.load().then(() => {
      this.initMap();
      this.setCurrentLocation();
      this.vehicleInit();
    
      this.webSocketService.routePath.subscribe(item => {
        console.log('New Path', item);
        this.handleMessage(item)
      })  

    });

    this.webSocketService.shopsArray.subscribe(array => {
      this.shopsInit(array);
    });

    // Подписка на приход нового заказа
    this.locationService.lastOrder.subscribe(item => {
      const orderPosition = new google.maps.LatLng(item.lat, item.lng);
      let repeted = false;
      // Проверка был ли уже этот заказ чтоб не создавать ещё раз
      this.locationService.ordersArray.forEach((coord) => {
        if (coord.lat() === orderPosition.lat()) {
          repeted = true;
        }
      })
      if (!repeted) {
        // В массиве только координаты заказов
        // Надо создать объект класса Заказ и хранить всё в нём
        this.locationService.ordersArray.push(orderPosition);
        repeted = false;

        // Полилайн для нарисовки маршрута
        // Надо сохранить полилинию в объекте маршрута чтоб удалить потом
        let orderPath = new google.maps.Polyline({
          path: this.locationService.orderPath,
          geodesic: true,
          strokeColor: '#489E45',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });
        orderPath.setMap(this.googleMap);

        // Движение машинки
        let freeVehicle: Vehicle;
        let order: Order;

        freeVehicle = this.getUnoccupiedVehicle();
        if (orderPath.getPath().getLength() > 1) {
          freeVehicle.color = this.vehicleColors[orderPath.getPath().getArray()[0].lat()];
        }
        if (freeVehicle) {
          order = new Order(freeVehicle, orderPosition, this.googleMap, this.orderIndex);
          this.orderIndex++;
          order.polyLine = orderPath;
          
          
          this.orderList.push(order);
          this.activeVehicles--;
          this.globalVariablesService.activeVehicle.next(this.activeVehicles);
        }
        this.movementToOrder(this.locationService.orderPath, order);
        this.ordersAwaiting++;
        this.globalVariablesService.ordersAwaiting.next(this.ordersAwaiting);
      }
    })
  }

  ngOnDestroy() {
    console.log('Map Destroy')
   this.webSocketService.closeWebSocket();
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }

  public markerDragEnd = ($event: MouseEvent) => {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
  }

  public initMap = () => {
    this.googleMap = new google.maps.Map(document.getElementById('map'), { zoom: 13, center: this.start });
  }

  public addMarker = (latlng, angle, marker, color) => {
    if (marker) {
      marker.setVisible(true);
      marker.setPosition(latlng);
      marker.setIcon(this.vehicleIconService.getIcon(angle, color))
    }
  }

  public getAngle = (start: google.maps.LatLng, end: google.maps.LatLng) => {
    let heading = google.maps.geometry.spherical.computeHeading(start, end);
    if (heading <= 0) {
      heading += 360;
    }
    return Math.round(heading);
  }

  public movementToOrder = (overview_path: google.maps.LatLng[], order: Order) => {
    if (overview_path && overview_path.length > 0) {
      let start: google.maps.LatLng;
      let end: google.maps.LatLng;
      let angle: Number;
      overview_path.forEach((elem, index) => {
        setTimeout(() => {
          start = order.vehicle.marker.getPosition();
          end = elem;
          angle = this.getAngle(start, end);

          this.addMarker(end, angle, order.vehicle.marker, order.vehicle.color)

          // Когда доехал до заказчика и обратно
          // Здесь надо удалить заказ и освободить машину
          if ((index + 1) === overview_path.length) {
            order.completedNumber++;
            overview_path = overview_path.reverse();
            if (order.completedNumber < 2) {
              this.movementToOrder(overview_path, order);
            } else {
              this.orderDelivered++;
              this.activeVehicles++;
              this.ordersAwaiting--;
              this.globalVariablesService.ordersAwaiting.next(this.ordersAwaiting);
              this.globalVariablesService.activeVehicle.next(this.activeVehicles);
              this.globalVariablesService.ordersDelivered.next(this.orderDelivered);
              order.polyLine.setMap(null);
              order.marker.setVisible(false);
              order.removeOrderMarker();
               this.locationService.ordersArray = this.locationService.ordersArray
               .filter(item => item != order.destination);
            }
          }
        }, index * 100)
      })
    }
  }

  public vehicleInit = () => {
    let markerOptions = {
      clickable: false,
      visible: false,
      title: 'Vehicle marker',
      position: this.start,
      map: this.googleMap,
      zindex: 9990,
      icon: this.vehicleIconService.getIcon(90, '#261EFF')
    }
    for (let i = 0; i < 20; i++) {
      let marker = new google.maps.Marker(markerOptions);
      let vehicle = new Vehicle(marker, '#261EFF');
      this.vehicleList.push(vehicle);
    }
    this.globalVariablesService.activeVehicle.next(this.vehicleList.length);
  }

  private getUnoccupiedVehicle = () => {
    let vehicle: Vehicle;
    this.vehicleList.forEach(item => {
      if (!item.occupied) {
        vehicle = item;
      }
    })
    vehicle.occupied = true;
    return vehicle;
  }

  public shopsInit = (shopsArray) => {
      shopsArray.shopList.forEach(item => {
        console.log('Init Shops', item)
        let latlng = new google.maps.LatLng(item.latLng.lat, item.latLng.lng)
        let shop = new Shop(latlng, item.name, this.googleMap);
        shop.createPolygon(item.polygon);
      })
  }

  public handleMessage = (message) => {
    // Меняем обсервеблы на которые подписан dashboard
    let lastOrder = message;

    // Получаем из меседжа массив маршрута и делаем из него массив координат
    let orderPath: google.maps.LatLng[];
    orderPath = lastOrder.order_path.map((item) => {
        return  new google.maps.LatLng(item.lat, item.lng)
    })

  //   // Сохраняем в переменную на сервисе
    this.locationService.orderPath = orderPath;

    // В сервисе только координаты последнего заказа
    let length = lastOrder.order_path.length - 1;
    this.locationService.lastOrder.next({lng: lastOrder.order_path[length].lng, lat: lastOrder.order_path[length].lat});
  }
}
