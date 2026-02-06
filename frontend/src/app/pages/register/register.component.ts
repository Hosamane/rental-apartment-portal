import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  submit() {
    if (this.registerForm.invalid) return;

    const { name, email, password, confirmPassword } =
      this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.register({ name, email, password }).subscribe({
      next: () => {
        this.success.set('Registration successful. Please login.');
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.error.set(err?.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }
}
