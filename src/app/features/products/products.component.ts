import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/service/product.service';
import { Product } from '../../core/model/product.model';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastService } from '../../core/service/toast.service';

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

  constructor(private productService: ProductService, private router: Router, private toast: ToastService) {
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
  
  removeProduct(productId: number | null): void {
    if (productId === null) return;
    
    const confirmed = window.confirm('Tem certeza de que quer excluir esse Produto ?');
    if(confirmed){
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          this.products = this.products.filter(product => product.id !== productId);
          this.toast.show("Produto removido com sucesso!");
        },
        error: (err) => {
          this.toast.show("Ocorreu um erro ao excluir o produto.");
          console.error('Erro ao deletar produto:', err);
        }
      });
    }
  }
}
