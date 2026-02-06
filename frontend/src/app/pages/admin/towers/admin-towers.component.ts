import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-towers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-towers.component.html'
})
export class AdminTowersComponent {

  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);

  towers = signal<any[]>([]);
  amenities = signal<any[]>([]);
  selectedAmenities = signal<number[]>([]);

  editingId = signal<number | null>(null);
  error = signal<string | null>(null);

  towerForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  // =====================
  // INIT
  // =====================
  ngOnInit() {
    this.loadTowers();
    this.loadAmenities();
  }

  // =====================
  // LOADERS
  // =====================
  loadTowers() {
    this.adminService.getTowers().subscribe({
      next: data => this.towers.set(data),
      error: () => this.error.set('Failed to load towers')
    });
  }

  loadAmenities() {
    this.adminService.getAmenities().subscribe(data => {
      this.amenities.set(data);
    });
  }

  // =====================
  // AMENITIES
  // =====================
  toggleAmenity(id: number) {
    const current = this.selectedAmenities();
    this.selectedAmenities.set(
      current.includes(id)
        ? current.filter(a => a !== id)
        : [...current, id]
    );
  }

  // =====================
  // CREATE / UPDATE
  // =====================
  submit() {
    if (this.towerForm.invalid) return;

    const payload = this.towerForm.getRawValue();
    const amenityIds = this.selectedAmenities();

    if (this.editingId()) {
      // UPDATE
      this.adminService.updateTower(this.editingId()!, payload)
        .subscribe(() => {
          this.adminService
            .saveTowerAmenities(this.editingId()!, amenityIds)
            .subscribe(() => {
              this.reset();
              this.loadTowers();
            });
        });

    } else {
      // CREATE
      this.adminService.createTower(payload)
        .subscribe((res: any) => {
          const towerId = res.tower_id;
          this.adminService
            .saveTowerAmenities(towerId, amenityIds)
            .subscribe(() => {
              this.reset();
              this.loadTowers();
            });
        });
    }
  }

  // =====================
  // EDIT
  // =====================
  edit(tower: any) {
    this.editingId.set(tower.id);
    this.towerForm.patchValue({ name: tower.name });

    this.adminService.getTowerAmenities(tower.id)
      .subscribe((res: any) => {
        const ids = res.amenities.map((a: any) => a.id);
        this.selectedAmenities.set(ids);
      });
  }

  // =====================
  // DELETE
  // =====================
  delete(id: number) {
    if (!confirm('Delete this tower?')) return;
    this.adminService.deleteTower(id)
      .subscribe(() => this.loadTowers());
  }

  // =====================
  // RESET
  // =====================
  reset() {
    this.editingId.set(null);
    this.selectedAmenities.set([]);
    this.towerForm.reset();
  }
}
