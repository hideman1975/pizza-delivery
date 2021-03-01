import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { IconRegisterService } from '../services/icon-register.service';
import { GlobalVariablesService } from '../services/global-variables.service';

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.scss']
})
export class MyNavComponent implements OnInit {

  public namespaceIcons = 'header';
  public activeVehicles: number = 0;
  public ordersDelivered: number = 0;
  public ordersAwaiting: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private iconService: IconRegisterService,
    private globalVariablesService: GlobalVariablesService
    
    ) {
      this.iconService.registerIcons(this.namespaceIcons, this.namespaceIcons, [
        'compact', 'trip', 'user', 'hourglass', 'general', 'car', 'nest']);
    }

    ngOnInit() {
      this.globalVariablesService.activeVehicle.subscribe(item => {
        this.activeVehicles = item;
      })
      this.globalVariablesService.ordersDelivered.subscribe(item => {
          this.ordersDelivered = item;
      })
      this.globalVariablesService.ordersAwaiting.subscribe(item => {
        this.ordersAwaiting = item;
    })
    }
}
