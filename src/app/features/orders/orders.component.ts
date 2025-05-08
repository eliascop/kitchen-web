import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order.model';
import { CommonModule } from '@angular/common';
import { FormatDateTimePipe } from "../../core/pipes/format-date-time.pipe";
import { OrderService } from '../../core/service/order.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormatDateTimePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{

  userId: number = 1;
  orders: Order[] = [];
  selectedOrder: any = null;

  constructor(private orderService: OrderService, private authService: AuthService) {}
  
  ngOnInit() {
    this.userId = this.authService.currentUserId!;
    this.getOrders(this.userId);
  }

  getOrders(userId: number) {
    this.orderService.getOrders(userId).subscribe((data) => {
      this.orders = data.data!;
    });
  }

  openModal(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }
  
}
