import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { environment } from '../../../environments/environment.dev';
import { Order } from '../../model/order.model';

export const ORDER_SERVICE_REST = environment.ORDER_REST_SERVICE;

@Injectable({
  providedIn: 'root',
})
export class OrderService {

  constructor(private dataService: DataService) {}

  getOrders(userId: number) {
    const params = {userId: userId};

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
