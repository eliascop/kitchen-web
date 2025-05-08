import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PasswordInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService, private authService: AuthService) {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.jwt);
        this.authService.notifyLogin();
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao efetuar login:', err);
      }
    });
  }
}