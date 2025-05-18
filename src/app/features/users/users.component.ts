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

  constructor(
    private userService: UserService, 
    private router: Router) {
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

  removeUser(userId: number | null): void {
    if (userId === null) return;
    
    const confirmed = window.confirm('Tem certeza de que quer excluir esse usuário ?');
    if(confirmed){
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.users = this.users.filter(user => user.id !== userId);
          alert("Usuário removido com sucesso!");
          console.log(response);
        },
        error: (err) => {
          alert("Ocorreu um erro ao excluir o usuário.");
          console.error('Erro ao deletar usuário:', err);
        }
      });
    }
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
