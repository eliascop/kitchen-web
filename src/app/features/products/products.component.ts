import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/service/product.service';
import { Product } from '../../model/product.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  userId: number = 1;
  products: Product[] = [];
  selectedOrder: any = null;

  constructor(private productService: ProductService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ngOnInit();
    });
  }
  
  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data.data!;
    });
  }

  goToNewProduct(){
    this.router.navigate(['/new-product']);
  }

  openModal(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }
  
}
