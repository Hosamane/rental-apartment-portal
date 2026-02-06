import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAmenitiesService } from '../../../services/admin-amenities.service';

@Component({
  selector: 'app-admin-amenities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-amenities.component.html'
})
export class AdminAmenitiesComponent {
  private service = inject(AdminAmenitiesService);
  private fb = inject(FormBuilder);

  amenities = signal<any[]>([]);
  editingId = signal<number | null>(null);

  amenityForm = this.fb.nonNullable.group({
    name: ['', Validators.required]
  });

  ngOnInit() {
    this.loadAmenities();
  }

  loadAmenities() {
    this.service.getAmenities().subscribe(res => {
      this.amenities.set(res);
    });
  }

  submit() {
    if (this.amenityForm.invalid) return;

    const data = this.amenityForm.getRawValue();

    if (this.editingId()) {
      this.service.updateAmenity(this.editingId()!, data)
        .subscribe(() => {
          this.reset();
          this.loadAmenities();
        });
    } else {
      this.service.createAmenity(data)
        .subscribe(() => {
          this.reset();
          this.loadAmenities();
        });
    }
  }

  edit(amenity: any) {
    this.editingId.set(amenity.id);
    this.amenityForm.patchValue({ name: amenity.name });
  }

  delete(id: number) {
    if (!confirm('Delete this amenity?')) return;

    this.service.deleteAmenity(id)
      .subscribe(() => this.loadAmenities());
  }

  reset() {
    this.editingId.set(null);
    this.amenityForm.reset();
  }
}
