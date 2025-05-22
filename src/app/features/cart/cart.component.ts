import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Product } from '../../model/product.model';
import { ProductService } from '../../core/service/product.service';
import { CartService } from '../../core/service/cart.service';
import { AuthService } from '../../core/service/auth.service';
import { Order } from '../../model/order.model';
import { User } from '../../model/user.model';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ProductService]
})
export class CartComponent implements OnInit {

  message: string | null = null;
  order: Order = new Order();
  productToSelect!: Product;
  products: Product[] = [];

  productTypes = [
    { key: 'drink', label: 'Bebida' },
    { key: 'meal', label: 'Refeição' },
    { key: 'accompaniment', label: 'Acompanhamentos' },
    { key: 'dessert', label: 'Sobremesa' },
    { key: 'pizza', label: 'Pizza' },
  ];
  cartForm: FormGroup;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.cartForm = this.fb.group({
      productId: [0, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      productType: ['drink', Validators.required]
    });
  }

  onTypeChange() {
    const typeKey = this.cartForm.get('productType')?.value;
    this.getProductsByType(typeKey);
  }

  ngOnInit() {
    this.order = new Order({ user: new User({ id: this.authService.currentUserId! }) });
    this.onTypeChange();

    this.route.queryParamMap.subscribe(params => {
      const messageParam = params.get('message');
      if (messageParam === 'cancelled') {
        this.message = 'Pagamento cancelado pelo usuário.';
      } else if (messageParam === 'errortocancel') {
        this.message = 'Ocorreu um erro ao cancelar pagamento.';
      }

      if (this.message) {
        setTimeout(() => this.message = null, 5000);
      }
    });
  }

  addProductToCart() {
    if (this.cartForm.valid) {
      const productId = this.cartForm.get('productId')?.value;
      const quantity = this.cartForm.get('quantity')?.value;

      this.getProductById(productId).subscribe({
        next: (productResponse) => {
          const product = productResponse.data!;
          this.order.addItem(product, quantity);
          this.cartForm.patchValue({ productId: 0, quantity: 1 });
        },
        error: (err) => {
          console.error('Erro ao buscar produto:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.cartForm);
    }
  }

  removeItem(index: number) {
    this.order.removeItem(index);
  }

  submitCart() {
    this.cartService.createPayment(this.order).subscribe({
      next: res => {
        const approvalUrl = res.data!.redirect;
        window.location.href = approvalUrl;
      },
      error: err => {
        alert('Erro ao iniciar pagamento: ' + err);
        console.error(err);
      }
    });
  }

  getProductById(productId: number) {
    return this.productService.getProductById(productId);
  }

  getProductsByType(type: string) {
    this.productService.getProductsByType(type).subscribe(data => {
      if (data.data)
        this.products = data.data;
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}