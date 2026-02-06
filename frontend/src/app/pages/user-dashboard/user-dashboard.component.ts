

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-dashboard.component.html'
})
export class UserDashboardComponent {
  private userService = inject(UserService);

  towers = signal<any[]>([]);
  units = signal<any[]>([]);
  loading = signal(false);

  selectedTowerId = signal<number | null>(null);
  today = new Date().toISOString().split('T')[0];
leaseStartDate: string | null = null;
leaseEndDate: string | null = null;
leaseError: string | null = null;


  ngOnInit() {
    this.loadTowers();
    this.loadUnits();
  }

  loadTowers() {
    this.userService.getTowers().subscribe({
      next: (res) => {
        console.log('TOWERS:', res);
        this.towers.set(res);
      },
      error: () => console.error('Failed to load towers')
    });
  }

  loadUnits() {
    this.loading.set(true);

    const params: any = {};
    if (this.selectedTowerId()) {
      params.tower_id = this.selectedTowerId();
    }

    this.userService.getUnits(params).subscribe({
      next: (res) => {
        this.units.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        alert('Failed to load units');
      }
    });
  }

  filterByTower(towerId: number | null) {
    this.selectedTowerId.set(towerId);
    this.loadUnits();
  }

// bookUnit(unitId: number) {
//   const payload = {
//     unit_id: unitId,
//     lease_start_option: 'TODAY', // or 'CUSTOM'
//     lease_days: 365
//   };

//   this.userService.bookUnit(payload).subscribe({
//     next: (res) => {
//       alert('Booking requested successfully');
//       console.log('BOOKING RESPONSE:', res);
//     },
//     error: (err) => {
//       console.error('BOOKING ERROR:', err);
//       alert(err?.error?.message || 'Failed to book unit');
//     }
//   });
// }

bookUnit(unitId: number) {
  this.leaseError = null;

  if (!this.leaseStartDate || !this.leaseEndDate) {
    this.leaseError = 'Please select start and end date';
    return;
  }

  const start = new Date(this.leaseStartDate);
  const end = new Date(this.leaseEndDate);

  const diffDays =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays < 30) {
    this.leaseError = 'Minimum lease period is 30 days';
    return;
  }

  const payload = {
    unit_id: unitId,
    lease_start_date: this.leaseStartDate,
    lease_end_date: this.leaseEndDate
  };

  this.userService.bookUnit(payload).subscribe({
    next: () => {
      alert('Booking requested successfully');
      this.leaseStartDate = null;
      this.leaseEndDate = null;
    },
    error: err => {
      alert(err.error?.message || 'Booking failed');
    }
  });
}




}
