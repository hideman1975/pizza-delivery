import { Vehicle } from './Vehicle';

export class Order {
    public index: number;
    public vehicle: Vehicle;
    public destination: google.maps.LatLng;
    public completed: boolean;
    public completedNumber: number;
    public polyLine: google.maps.Polyline;
    public marker: google.maps.Marker;
    public map;

    constructor(vehicle: Vehicle, destination: google.maps.LatLng, map, index) {
        this.vehicle = vehicle;
        this.destination = destination;
        this.completed = false;
        this.completedNumber = 0;
        this.map = map;
        this.index = index;

      this.createOrderMarker();  
      const info = '<div><h3>Pizza Margarita 40X40 3 unit</h3></div>' + '<div> Order - '+ this.index +'</div>'
        const infowindow = new google.maps.InfoWindow({
          content: info
        });
      this.marker.addListener('click', () => {
        infowindow.open(map, this.marker);
        console.log('Order destination Lat', this.destination.lat())
        console.log('Order Marker Lat', this.marker.getPosition().lat())
      });
    }

      private createOrderMarker = () => {
        this.marker = new google.maps.Marker(
          {
            position: this.destination,
            clickable: true,
            draggable: false,
            map: this.map, 
            animation: google.maps.Animation.DROP,
            icon: "assets/images/pizza.svg"
          }
        );
      }
      
      public removeOrderMarker = () => {
        this.marker.setMap(null);
        this.vehicle.occupied = false;
      }
}