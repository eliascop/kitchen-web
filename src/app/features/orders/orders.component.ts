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

  orders: Order[] = [];
  selectedOrder: any = null;

  constructor(private orderService: OrderService) {}
  
  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe((data) => {
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
