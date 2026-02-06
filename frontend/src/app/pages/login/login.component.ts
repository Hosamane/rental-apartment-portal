import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login.component.html'
   
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

 submit() {
  if (this.loginForm.invalid) {
    this.error.set('Please enter valid credentials');
    return;
  }

  this.loading.set(true);
  this.error.set(null);

  const { email, password } = this.loginForm.getRawValue();

  this.auth.login(email, password)
    .pipe(finalize(() => this.loading.set(false)))
    .subscribe({
      next: (res) => {
        // Save token + user
        localStorage.setItem('access-token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // Redirect by role
        if (res.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.user.role === 'USER'){
          this.router.navigate(['/user']);
        }
      },
      error: () => {
        this.error.set('Invalid email or password');
      }
    });
}

}
