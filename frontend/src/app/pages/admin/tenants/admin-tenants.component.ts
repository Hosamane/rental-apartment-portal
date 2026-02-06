import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminTenantsService } from '../../../services/admin-tenants.service';

@Component({
  selector: 'app-admin-tenants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-tenants.component.html'
})
export class AdminTenantsComponent {
  private service = inject(AdminTenantsService);
  private fb = inject(FormBuilder);

  tenants = signal<any[]>([]);
  loading = signal(false);
  towers = signal<any[]>([]);
units = signal<any[]>([]);


  // filterForm = this.fb.nonNullable.group({
  filterForm = this.fb.group({
    type: ['all'],          // all | current | previous
    tower_id: [''],
    unit_id: [''],
    tenant_type: [''],      // STUDENT / WORKING
    lease_ending_days: [''] // eg: 30
  });

//   filterForm = this.fb.group({
//   type: ['all'],
//   tower_id: [''],
//   unit_id: [''],
//   tenant_type: [''],
//   lease_ending_days: ['']
// });

ngOnInit() {
  this.loadTowers();
  this.loadTenants();
}


loadTowers() {
  this.service.getTowers().subscribe(res => {
    this.towers.set(res);
  });
}


onTowerChange(towerId: number | null) {
  this.filterForm.patchValue({ unit_id: null });

  if (!towerId) {
    this.units.set([]);
    return;
  }

  this.service.getUnitsByTower(towerId).subscribe(res => {
    this.units.set(res);
  });
}

  // loadTenants() {
  //   this.loading.set(true);

  //   const raw = this.filterForm.getRawValue();
  //   const filters: any = {};

  //   if (raw.type !== 'all') filters.type = raw.type;
  //   if (raw.tower_id) filters.tower_id = raw.tower_id;
  //   if (raw.unit_id) filters.unit_id = raw.unit_id;
  //   if (raw.tenant_type) filters.tenant_type = raw.tenant_type;
  //   if (raw.lease_ending_days) filters.lease_ending_days = raw.lease_ending_days;

  //   this.service.getTenants(filters).subscribe(res => {
  //     this.tenants.set(res.tenants);
  //     this.loading.set(false);
  //   });
  // }

  loadTenants() {
  const raw = this.filterForm.getRawValue();

  // Build query params CLEANLY
  const params: any = {};

  if (raw.type && raw.type !== 'all') {
    params.type = raw.type;
  }

  if (raw.tower_id) {
    params.tower_id = raw.tower_id;
  }

  if (raw.unit_id) {
    params.unit_id = raw.unit_id;
  }

  if (raw.tenant_type) {
    params.tenant_type = raw.tenant_type;
  }

  if (raw.lease_ending_days) {
    params.lease_ending_days = raw.lease_ending_days;
  }

  this.service.getTenants(params).subscribe({
    next: (res) => {
      this.tenants.set(res.tenants);
    },
    error: (err) => {
      console.error(err);
    }
  });
}


  reset() {
    this.filterForm.reset({
      type: 'all',
      tower_id: '',
      unit_id: '',
      tenant_type: '',
      lease_ending_days: ''
    });
    this.loadTenants();
  }
}
