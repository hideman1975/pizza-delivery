import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
    public vehicleObserver = new Subject<any[]>();
    public activeVehicle = new Subject<number>();
    public ordersDelivered = new Subject<number>();
    public ordersAwaiting = new Subject<number>();
    constructor( ) { }

  
}
