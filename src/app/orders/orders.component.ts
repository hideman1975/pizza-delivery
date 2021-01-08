import { Component, OnInit } from '@angular/core';
import { WebSocketAPI } from '../WebSocketAPI';
import { AppComponent} from '../app.component'

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor() { 
    this.dima();
  }

   webSocketAPI: WebSocketAPI;
   greeting: any;
   name: string;
   location: string;
   
   ngOnInit() { 
    console.log('Orders OnInit')
     this.location = 'Start Location'
   }

    // Простая функция
   dima() {
     //console.log('Димина первая програмка');
     // Объявление переменных
     let b;
     let c;
     // Присвоение перменным значений
     b = 29;
     c = 99;
    
     // Блок проверки условия
     if (b!=c) {
        if (b>c) {
        console.log('Да! Б больше С');
      } else {
        console.log('Нет! Б меньше С');
      }
     } else {
      console.log('Б и С равны. Не буду их сравнивать' );
     }
     
   }
   // Конец функции

}
