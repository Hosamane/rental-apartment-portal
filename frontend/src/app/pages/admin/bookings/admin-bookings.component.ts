import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBookingsService } from '../../../services/admin-bookings.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-bookings.component.html',
  //  styleUrl: './bookings.css',
})
export class AdminBookingsComponent {
  private adminService = inject(AdminBookingsService);

 bookings = signal<any[]>([]);
currentFilter = signal<'ALL' | 'PENDING' | 'APPROVED' | 'DECLINED'>('ALL');

ngOnInit() {
  this.loadBookings();
}

setFilter(status: 'ALL' | 'PENDING' | 'APPROVED' | 'DECLINED') {
  this.currentFilter.set(status);
  this.loadBookings();
}

loadBookings() {
  const status =
    this.currentFilter() === 'ALL'
      ? undefined
      : this.currentFilter();

  this.adminService.getBookings(status).subscribe({
    next: (res) => {
      console.log('API RESPONSE:', res); // 🔴 IMPORTANT

      // 🔥 HANDLE BOTH RESPONSE TYPES
      const data = Array.isArray(res)
        ? res
        : res.bookings;

      this.bookings.set(data ?? []);
    },
    error: () => alert('Failed to load bookings')
  });
}

  approve(id: number) {
    this.adminService.approveBooking(id).subscribe(() => {
      this.loadBookings();
    });
  }

  decline(id: number) {
    this.adminService.declineBooking(id).subscribe(() => {
      this.loadBookings();
    });
  }
}
// import { Component, inject, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';   // ✅ REQUIRED
// // import {  } from '../../../services/admin.service';
// import { AdminBookingsService } from '../../../services/admin-bookings.service';

// @Component({
//   selector: 'app-admin-bookings',
//   standalone: true,
//   imports: [CommonModule],   // ✅ THIS FIXES EVERYTHING
//   templateUrl: './admin-bookings.component.html'
// })
// export class AdminBookingsComponent {
//   private adminService = inject(AdminBookingsService);

//   bookings = signal<any[]>([]);
//   filter = signal<string>('ALL');

//   ngOnInit() {
//     this.fetch();
//   }

//   setFilter(status: string) {
//     this.filter.set(status);
//     this.fetch();
//   }

//   fetch() {
//   const status =
//     this.filter() === 'ALL' ? undefined : this.filter();

//   this.adminService.getBookings(status).subscribe({
//     next: (res) => {
//       console.log('RAW API RESPONSE:', res);

//       // 🔥 THIS IS THE FIX
//       this.bookings.set(res.bookings ?? []);
//     },
//     error: (err) => {
//       console.error('API ERROR:', err);
//       alert('Failed to load bookings');
//     }
//   });
// }

//   approve(id: number) {
//     this.adminService.approveBooking(id).subscribe(() => this.fetch());
//   }

//   decline(id: number) {
//     this.adminService.declineBooking(id).subscribe(() => this.fetch());
//   }
// }
