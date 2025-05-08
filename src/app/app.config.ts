import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './core/interceptors/http-interceptor.service';
import { AuthGuardService } from './core/service/auth.guard.service';

import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CartComponent } from './features/cart/cart.component';
import { UsersComponent } from './features/users/users.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProductsComponent } from './features/products/products.component';
import { NewProductComponent } from './features/new-product/new-product.component';
import { TrackingComponent } from './features/tracking/tracking.component';

export const routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardService] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuardService] },
  { path: 'new-product', component: NewProductComponent, canActivate: [AuthGuardService] },
  { path: 'tracking/:orderId', component: TrackingComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: '/login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ]
};
