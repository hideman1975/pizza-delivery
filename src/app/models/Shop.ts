

export class Shop {
    public index: number;
    public latlng: google.maps.LatLng;
    public name: String;
    public marker: google.maps.Marker;
    public map;

    constructor(latlng: google.maps.LatLng, name: String, map) {
        this.latlng = latlng;
        this.name = name;
        this.map = map;

        this.createShopMarker();
        //this.createPolygon();
        this.createInfoWindow();
        
    }

    private createShopMarker = () => {
        this.marker = new google.maps.Marker(
          {
            position: this.latlng,
            clickable: true,
            draggable: false,
            map: this.map, 
            animation: google.maps.Animation.DROP,
            icon: "assets/images/cooker.png"
          }
        );
      }
      
      public removeOrderMarker = () => {
        this.marker.setMap(null);
      }

      public createPolygon = (polygon) => {
        // const triangleCoords = [
        //     { lat: 25.774, lng: -80.19 },
        //     { lat: 18.466, lng: -66.118 },
        //     { lat: 32.321, lng: -64.757 },
        //     { lat: 25.774, lng: -80.19 },
        //   ];
        
          // Construct the polygon.
          const bermudaTriangle = new google.maps.Polygon({
            paths: polygon,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });
          bermudaTriangle.setMap(this.map);
        
      }

      private createInfoWindow = () => {
        const info = '<div><h3>Pizzeria</h3></div>' + '<div> Name - '+ this.name +'</div>'
        const infowindow = new google.maps.InfoWindow({
          content: info
        });
      this.marker.addListener('click', () => {
        infowindow.open(this.map, this.marker);
      });
      }
}