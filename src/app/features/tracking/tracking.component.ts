import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../model/order.model';
import { CommonModule } from '@angular/common';
import { OrderSocketService } from '../../core/service/order.socket.service';
import { OrderService } from '../../core/service/order.service';

const statusMap: Record<string, string> = {
  PREPARING: 'Seu pedido está sendo preparado',
  PEDING: 'Seu pedido está aguardando ser preparado',
  PREPARED: 'Oba! Seu pedido está pronto!',
};

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  standalone: true,
  styleUrls: ['./tracking.component.css'],
  imports: [CommonModule]
})
export class TrackingComponent implements OnInit, OnDestroy {
  orderId!: number;
  order!: Order;
  statusMessage: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderSocketService: OrderSocketService,
    private orderService: OrderService
  ) {}


  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    if (!this.orderId) {
      this.statusMessage = 'Pedido inválido.';
      return;
    }
    this.orderService.getOrderById(this.orderId).subscribe(
      data => {
        this.order = data.data!;
    });
    
    this.orderSocketService.connectToOrder(this.orderId, (orderUpdated) => {
      this.order = orderUpdated;

      this.statusMessage = statusMap[orderUpdated.status] || 'Aguardando atualização...';
      if(this.order.status === 'PREPARED'){
        this.orderSocketService.disconnect();
      }
    });
  }

  ngOnDestroy(): void {
    this.orderSocketService.disconnect();
  }
  
}
