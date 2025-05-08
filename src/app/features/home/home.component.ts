import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  newOrder() {
    this.router.navigate(['/cart']);
  }

  orderList() {
    this.router.navigate(['/orders']);
  }

  productList() {
    this.router.navigate(['/products']);
  }

  userList() {
    this.router.navigate(['/users']);
  }
}
