import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../../model/order.model';
import { environment } from '../../../environments/environment.dev';
import { OrderSocketService } from '../../core/service/order.socket.service';
import { OrderService } from '../../core/service/order.service';
import { FormatDateTimePipe } from "../../core/pipes/format-date-time.pipe";

export const ORDER_SOCKET_SERVICE = environment.ORDER_SOCKET_SERVICE;

@Component({
  selector: 'app-orders-painel',
  standalone: true,
  imports: [CommonModule, FormatDateTimePipe],
  templateUrl: './orders-painel.component.html',
  styleUrl: './orders-painel.component.css'
})
export class OrdersPainelComponent implements OnInit, OnDestroy {

  orders: { [key: string]: Order[] } = {
    PENDING: [],
    PREPARING: [],
    PREPARED: []
  };

  constructor(
    private orderSocketService: OrderSocketService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadOrders();

    this.orderSocketService.connectToAllOrders((orderUpdated) => {
      this.updateOrderStatus(orderUpdated.orderId, orderUpdated.status);
    });
  }

  ngOnDestroy() {
    this.orderSocketService.disconnect();
  }

  private updateOrderStatus(orderId: number, newStatus: string) {
    let movedOrder: Order | undefined;
  
    for (const statusKey of Object.keys(this.orders)) {
      const currentColumn = this.orders[statusKey];
      const foundOrder = currentColumn.find(order => order.id === Number(orderId));
  
      if (foundOrder) {
        this.orders[statusKey] = currentColumn.filter(order => order.id !== Number(orderId));
        
        foundOrder.status = newStatus;
  
        if (!this.orders[newStatus]) {
          this.orders[newStatus] = [];
        }
  
        this.orders[newStatus].push(foundOrder);
        return;
      }
    }
  
    console.warn(`Pedido com ID ${orderId} não encontrado em nenhuma coluna.`);
  }
  
  
  

  private loadOrders(){
    this.orderService.getOrders().subscribe((data) => {
      this.orders = {
        PENDING: [],
        PREPARING: [],
        PREPARED: []
      };

      for (const order of data.data || []) {
        const status = (order.status || '').toUpperCase();
        if (this.orders[status]) {
          this.orders[status].push(order);
        } else {
          console.warn(`Status desconhecido: ${status}`, order);
        }
      }
    });
  }
}
