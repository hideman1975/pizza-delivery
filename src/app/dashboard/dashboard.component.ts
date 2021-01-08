import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent, AgmCoreModule } from '@agm/core';
import { endWith } from 'rxjs/operators';
import { VehicleIconService } from '../services/vehicle-icon.service';
//import { WebSocketAPI } from '../WebSocketAPI';
import { LocationService } from '../services/location.service';
import { Vehicle } from '../models/Vehicle';
import { Order } from '../models/Order';
import { ShopSocketService } from '../services/shop-socket.service';
import { Shop } from '../models/Shop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  latitude = null;
  longitude = null;
  zoom = 15;
  address: string;
  //private geoCoder;
  //webSocketAPI: WebSocketAPI;
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
  //serverVehicle: Vehicle;
  private start;
  public orderDelivered: number = 0;
  public orderList: Order[] = [];
  public vehicleList: Vehicle[] = [];
  public orderCounter: number = 0;
  public orderIndex: number = 0;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private vehicleIconService: VehicleIconService,
    private ngZone: NgZone,
    private locationService: LocationService
  ) { }

  ngOnInit(): void {
    this.start = new google.maps.LatLng(56.32628302868094, 43.957951068878174);

    this.mapsAPILoader.load().then(() => {
      this.initMap();
      this.setCurrentLocation();
      this.vehicleInit();
     
    });

    // Подписываемся на приход координат 
    this.locationService.shopsArray.subscribe(array => {
     this.shopsInit(array);
    })

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
        if (freeVehicle) {
          order = new Order(freeVehicle, orderPosition, this.googleMap, this.orderIndex);
          this.orderIndex++;
          order.polyLine = orderPath;
          this.orderList.push(order);
        }
        this.movementToOrder(this.locationService.orderPath, order);
      }
      //this.shopsInit();
    })
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

  public addMarker = (latlng, angle, marker) => {
    if (marker) {
      marker.setPosition(latlng);
      marker.setIcon(this.vehicleIconService.getIcon(angle, marker.color))
    }
  }

  public vehicleMove = (route, angle, car) => {
    route.forEach((element, index) => {
      setTimeout(() => {
        this.addMarker(element, angle, this.markers[car].marker)
      }, index * 10)
    })
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
          this.addMarker(end, angle, order.vehicle.marker)

          // Когда доехал до заказчика и обратно
          // Здесь надо удалить заказ и освободить машину
          if ((index + 1) === overview_path.length) {
            order.completedNumber++
            this.orderDelivered++;
            overview_path = overview_path.reverse();
            if (order.completedNumber < 2) {
              this.movementToOrder(overview_path, order);
            } else {
              order.polyLine.setMap(null);
              order.removeOrderMarker();
               this.locationService.ordersArray = this.locationService.ordersArray
               .filter(item => item != order.destination);
            }
          }
        }, index * 500)

      })
    }
  }

  public vehicleInit = () => {
    let markerOptions = {
      clickable: false,
      title: 'Vehicle marker',
      position: this.start,
      map: this.googleMap,
      zindex: 9990,
      icon: this.vehicleIconService.getIcon(90, '#59FF30')
    }
    for (let i = 0; i < 20; i++) {
      let marker = new google.maps.Marker(markerOptions);
      let vehicle = new Vehicle(marker, '#FF268F');
      this.vehicleList.push(vehicle);
    }
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
      shopsArray.forEach(item => {
        console.log('Init Shops', item)
        let latlng = new google.maps.LatLng(item.latlng.lat, item.latlng.lng)
        let shop = new Shop(latlng, item.name, this.googleMap);
        shop.createPolygon(item.polygon);
      })
  }
}
