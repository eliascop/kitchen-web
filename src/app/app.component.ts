import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from './model/user.model';
import { AuthService } from './core/service/auth.service';
import { UserService } from './core/service/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'kitchen-web';

  userId!: number | null;
  user!: User;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.userService.getUserById(this.userId!).subscribe(response => {
          this.user = response.data!;
        });
      } else {
        this.userId = null;
        this.user = undefined!;
      }
    });
  }
  goHome(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate(['/']);
  }

  logout(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
