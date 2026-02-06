import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminUnitsService } from '../../../services/admin-units.service';
@Component({
  selector: 'app-admin-units',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-units.component.html',
  // styleUrl:'.src/style.scss'
})
export class AdminUnitsComponent {
  private service = inject(AdminUnitsService);
  private fb = inject(FormBuilder);


  towers = signal<any[]>([]);

  units = signal<any[]>([]);
  editingId = signal<number | null>(null);
  loading = signal(false);

 unitForm = this.fb.group({
  tower_id: [null, Validators.required],
  unit_number: ['', Validators.required],
  bedrooms: [null, Validators.required],
  rent: [null, Validators.required],
  status: ['AVAILABLE']
});

  ngOnInit() {
    this.loadUnits();
    this.loadTowers();
  }

  loadUnits() {
    this.loading.set(true);
    this.service.getUnits().subscribe(res => {
      this.units.set(res);
      this.loading.set(false);
    });
  }

  loadTowers() {
  this.service.getTowers().subscribe(res => {
    this.towers.set(res);
  });
}

  submit() {
    if (this.unitForm.invalid) return;

    const data = this.unitForm.getRawValue();

    if (this.editingId()) {
      this.service.updateUnit(this.editingId()!, data).subscribe(() => {
        this.reset();
        this.loadUnits();
      });
    } else {
      this.service.createUnit(data).subscribe(() => {
        this.reset();
        this.loadUnits();
      });
    }
  }

  edit(unit: any) {
  this.editingId.set(unit.id);
  this.unitForm.patchValue(unit);
}

  delete(id: number) {
    if (!confirm('Delete this unit?')) return;
    this.service.deleteUnit(id).subscribe(() => this.loadUnits());
  }

 

  reset() {
    this.unitForm.reset({
      status: 'AVAILABLE'
    });
    this.editingId.set(null);
  }

}
