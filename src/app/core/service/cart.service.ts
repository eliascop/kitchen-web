import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment.dev';
import { Order } from '../../model/order.model';

export const PAYMENT_SERVICE_URL = environment.PAYMENT_RESET_SERVICE;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private dataService: DataService) {}

  createPayment(order: Order) {
    return this.dataService.post<{redirect: string}>({
      url: `${PAYMENT_SERVICE_URL}`,
      body: order
    }); 
  }
}
