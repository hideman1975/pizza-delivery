

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
          // Construct the polygon.
          const bermudaTriangle = new google.maps.Polygon({
            paths: polygon,
            strokeColor: "#FFFFFF",
            editable: false,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FFC83D",
            fillOpacity: 0.35,
          });
          bermudaTriangle.setMap(this.map);
          bermudaTriangle.addListener('click', () => {
            this.getPathCoordinates(bermudaTriangle.getPath().getArray());
          });
      }

      private createInfoWindow = () => {
        console.log('-----------------------Info Window---------------------------');
        const info = '<div><h3>Pizzeria</h3></div>' + '<div> Name - '+ this.name +'</div>'
        const infowindow = new google.maps.InfoWindow({
          content: info
        });
      this.marker.addListener('click', () => {
        infowindow.open(this.map, this.marker);
      });
      }

      private getPathCoordinates = (path: Array<google.maps.LatLng>) => {
        path.forEach(item => {
          console.log('LatLng', item.lat() + '--' + item.lng())
        })
      }
}