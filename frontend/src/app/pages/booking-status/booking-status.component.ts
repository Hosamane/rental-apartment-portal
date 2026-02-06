import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-booking-status',
  imports: [CommonModule],
  templateUrl: './booking-status.component.html',
  // styleUrl: './booking-status.css',
  standalone:true
})
export class BookingStatusComponent {
  private userService = inject(UserService);

  bookings = signal<any[]>([]);
  loading = signal(false);
  selectedStatus = signal<'ALL' | 'PENDING' | 'APPROVED' | 'DECLINED'>('ALL');

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings(status?: string) {
    this.loading.set(true);

    const params = status && status !== 'ALL'
      ? { status }
      : {};

    this.userService.getBookings(params).subscribe(res => {
      this.bookings.set(res);
      this.loading.set(false);
    });
  }

  filter(status: 'ALL' | 'PENDING' | 'APPROVED' | 'DECLINED') {
    this.selectedStatus.set(status);
    this.loadBookings(status);
  }
}

