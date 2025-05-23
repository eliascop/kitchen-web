import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/service/product.service';
import { CurrencyFormatterPipe } from '../../core/pipes/currency-input.pipe';
import { Router } from '@angular/router';
import { ToastService } from '../../core/service/toast.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CurrencyFormatterPipe],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  productForm: FormGroup;
  priceControl = new FormControl('', [Validators.required, Validators.pattern(/^\d+(,\d{1,2})?$/)]);

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private toast: ToastService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      price: this.priceControl
    });
  } 

  ngOnInit(): void {
    this.priceControl.valueChanges.subscribe(value => {
      this.productForm.patchValue({ price: value }, { emitEvent: false });
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = { ...this.productForm.value };
      formData.price = formData.price.replace(',', '.');

      this.productService.createProduct(formData).subscribe({
        next: (res: any) => {
          this.router.navigate(['/products']);
          this.productForm.reset();
          this.toast.show('Produto cadastrado com sucesso.');
        },
        error: (err) => {
          this.toast.show('Ocorreu um erro ao salvar o produto.');
          console.error('Erro ao salvar o produto:', err);
        }
      });
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.controls[key].markAsTouched();
      });
    }
  }
}



