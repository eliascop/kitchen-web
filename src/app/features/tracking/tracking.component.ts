import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject, throwError } from 'rxjs';
import { switchMap, takeUntil, catchError, tap } from 'rxjs/operators';
import { Order } from '../../model/order.model';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/service/order.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  orderFounded: boolean = true;
  private unsubscribe$ = new Subject<void>();
  private stopTimer$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('orderId'));

    interval(5000).pipe(
      takeUntil(this.unsubscribe$),
      takeUntil(this.stopTimer$),
      switchMap(() => this.orderService.getOrderById(this.orderId).pipe(
        tap(data => {
          if (data.data?.status === 'PREPARED') {
            this.stopTimer$.next(); 
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.orderFounded = false;
            this.stopTimer$.next();
          }
          return throwError(() => error);
        })
      ))
    ).subscribe({
      next: (data) => {
        this.order = data.data!;
      },
      error: (err) => {
        this.orderFounded = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.stopTimer$.next();
    this.stopTimer$.complete();
  }
}

