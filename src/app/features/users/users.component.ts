import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { User } from '../../model/user.model';
import { UserService } from '../../core/service/user.service';
import { PhoneNumberPipe } from "../../core/pipes/phone-number.pipe";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PhoneNumberPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {

  userId: number = 1;
  users: User[] = [];
  selectedOrder: any = null;

  constructor(private userService: UserService, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.ngOnInit();
    });
  }
  
  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data.data!;
    });
  }

  goToNewUser(){
    this.router.navigate(['/new-user']);
  }

  openModal(order: any) {
    this.selectedOrder = order;
  }

  closeModal() {
    this.selectedOrder = null;
  }
  
}
