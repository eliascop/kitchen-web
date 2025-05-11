import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment.dev';
import { Order } from '../../model/order.model';
import { AuthService } from './auth.service';

export const ORDER_SERVICE_REST = environment.ORDER_REST_SERVICE;

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(private dataService: DataService, private authService: AuthService) {}
        
  getOrders() {
    const params = {userId: this.authService.currentUserId!};

    return this.dataService.get<Order[]>({
      url: `${ORDER_SERVICE_REST}/search`,
      params
    });
  }

  getOrderById(orderId: number) {
    return this.dataService.get<Order>({
      url: `${ORDER_SERVICE_REST}/${orderId}`
    });
  }
}
