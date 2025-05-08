import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../model/cart.model';
import { Product } from '../../model/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../../core/service/product.service';
import { CartService } from '../../core/service/cart.service';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ProductService]
})
export class CartComponent implements OnInit {

  userId: number = 0;
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  product!: Product;
  products: Product[] = [];
  productTypes = [
    { key: 'drink', label: 'Bebida' },
    { key: 'meal', label: 'Refeição' },
    { key: 'accompaniment', label: 'Acompanhamentos' },
    { key: 'dessert', label: 'Sobremesa' },
    { key: 'pizza', label: 'pizza' },
  ];
  cartForm: FormGroup;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
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
    this.userId = this.authService.currentUserId!;
    this.onTypeChange();
  }

  addProductToCart() {
    if (this.cartForm.valid) {
      const productId = this.cartForm.get('productId')?.value;
      const quantity = this.cartForm.get('quantity')?.value;

      this.getProductById(productId).subscribe({
        next: (product) => {
          this.product = product.data!;

          if (this.product) {
            const existingItem = this.cartItems.find(item => item.product.id === this.product.id);
            if (existingItem) {
              existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
            } else {
              this.cartItems.push({
                product: this.product,
                quantity: quantity,
                id: 0,
                value: 0
              });
            }

            this.getTotalPrice();
            this.cartForm.patchValue({ productId: 0, quantity: 1 });
          }
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
    this.cartItems.splice(index, 1);
    this.getTotalPrice();
  }

  submitCart() {
    const payload = {
      user: { id: this.userId },
      items: this.cartItems.map(item => ({
        product: { id: item.product.id },
        quantity: item.quantity
      }))
    };

    this.cartService.createCart(payload).subscribe({
      next: res => {
        const orderId = res.data?.orderId;
        alert('Pedido enviado com sucesso!\nSeu número para entrega é: ' + orderId);
        this.cartItems = [];
        this.cartForm.patchValue({ productId: 0 });
        this.router.navigate(['/tracking', orderId]);
      },
      error: (err: any) => {
        alert('Ocorreu um erro ao enviar o pedido!');
      }
    });
  }

  getTotalPrice() {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
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