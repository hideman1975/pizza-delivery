import {VehicleIconService} from '../services/vehicle-icon.service';

export class Vehicle {
    public marker: google.maps.Marker;
    public color: string;
    public position: google.maps.LatLng;
    public vehicleIconService = new VehicleIconService();
    private angle = 90;
    public occupied: boolean;

    constructor(marker, color) {
      this.marker = marker;
      this.color = color;
      this.position = this.marker.getPosition();
      this.occupied = false;
    }
  
    changePosition = (newPosition: google.maps.LatLng) => {
      
      const distance = google.maps.geometry.spherical.computeDistanceBetween(this.position, newPosition);
      this.getRoutePoints(this.position, newPosition);
  
      if (this.position) {
        this.angle = this.getAngle(this.position, newPosition);
      }
      
      this.marker.setIcon(this.vehicleIconService.getIcon(this.angle, '#261EFF'));
      //this.marker.setPosition(newPosition);
      //this.position = newPosition;
    }
  
    public getAngle = (start, end) => {
      let heading = google.maps.geometry.spherical.computeHeading(start, end);
      if (heading <= 0) {
        heading += 360;
      }
      return Math.round(heading);
    }
  
    // Скопировал функцию разбивки отрезка на участки
    getRoutePoints = (start: google.maps.LatLng, end: google.maps.LatLng) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(start, end);
      //let div = Math.floor(distance / 5);
      let dX =  end.lat() - start.lat()
      let dY =  end.lng() - start.lng()
      let stepX = dX /5;
      let stepY = dY /5;
      let arr = []
          for (let i = 0; i < 5; i++) {
            //arr.push({lat: start.lat()+stepX*i, lng: start.lng()+stepY*i})
            setTimeout(() => {
              const position = new google.maps.LatLng(start.lat()+stepX*i, start.lng()+stepY*i)
              this.marker.setPosition(position);
              this.position = position;
              //console.log(i, 'points-lat', start.lat()+stepX*i)
              //console.log(i, 'points-lng', start.lng()+stepY*i)
            }, 200*i)
            
          }
          //return arr
    }
  }
  