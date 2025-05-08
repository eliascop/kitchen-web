import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ServiceResponse } from './model/http-options-request.model';
import { environment } from '../../../environments/environment.dev';

export const CART_SERVICE_URL = environment.CART_REST_SERVICE;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private dataService: DataService) {}

  createCart(cartData: any): ServiceResponse<{orderId: number, message: string }> {
    return this.dataService.post<{orderId: number, message: string }>({
      url: CART_SERVICE_URL,
      body: cartData,
    });
  }
}
