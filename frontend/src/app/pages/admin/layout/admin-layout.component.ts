import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router,RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  // styleUrl: 'frontend/src/styles.css',
  // styleUrl:'./layout.css',
  standalone:true
})


export class AdminLayoutComponent {
  private router = inject(Router);

  logout() {
    localStorage.clear();
    localStorage.removeItem('access-token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
