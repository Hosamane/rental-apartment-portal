import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-tenant-profile',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './tenant-profile.component.html',
  standalone:true
})
export class TenantProfileComponent {
  private fb=inject(FormBuilder);
  private userService = inject(UserService);

  loading = signal(false);
  readonlyMode = signal(true);
  userName = signal<string>('');

  success = signal<string | null>(null);
  error = signal<string | null>(null);


 profileForm = this.fb.nonNullable.group({
    tenant_type: ['', Validators.required], // STUDENT / WORKING
    date_of_birth: ['', Validators.required],

    college_name: [''],
    department: [''],

    company_name: [''],
    designation: [''],

    id_proof_type: ['', Validators.required],
    id_proof_number: ['', Validators.required]
  });
ngOnInit() {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    this.userName.set(parsed.name);
  }

  this.loadProfile(); 
  
  
  
  // this.profileForm.get('tenant_type')!
  //   .valueChanges.subscribe(type => {
  //     this.applyConditionalValidators(type);
  //   });

// (optional if you already fetch profile)
}
// applyConditionalValidators(type: string) {
//   const college = this.profileForm.get('college_name')!;
//   const department = this.profileForm.get('department')!;
//   const company = this.profileForm.get('company_name')!;
//   const designation = this.profileForm.get('designation')!;

//   // Clear all first
//   college.clearValidators();
//   department.clearValidators();
//   company.clearValidators();
//   designation.clearValidators();

//   // Reset values of unused fields (optional but clean UX)
//   college.reset();
//   department.reset();
//   company.reset();
//   designation.reset();

//   if (type === 'STUDENT') {
//     college.setValidators(Validators.required);
//     department.setValidators(Validators.required);
//   }

//   if (type === 'WORKING') {
//     company.setValidators(Validators.required);
//     designation.setValidators(Validators.required);
//   }

//   // Recalculate validity
//   college.updateValueAndValidity();
//   department.updateValueAndValidity();
//   company.updateValueAndValidity();
//   designation.updateValueAndValidity();
// }

loadProfile() {
  this.loading.set(true);

  this.userService.getProfile().subscribe({
    next: (data) => {
      this.profileForm.patchValue(data);
      this.profileForm.disable(); // 🔒 READ MODE
      this.readonlyMode.set(true);
      this.loading.set(false);
    },
    error: () => {
      this.loading.set(false);
    }
  });
}
enableEdit() {
  this.profileForm.enable(); // ✏️ EDIT MODE
  this.readonlyMode.set(false);
}

 submit() {
  if (this.profileForm.invalid) return;

  this.loading.set(true);
  this.success.set(null);
  this.error.set(null);

  this.userService.updateProfile(this.profileForm.getRawValue())
    .subscribe({
      next: () => {
        this.success.set('Profile updated successfully');
        this.profileForm.disable(); // 🔒 back to read-only
        this.readonlyMode.set(true);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(err?.error?.message || 'Failed to save profile');
        this.loading.set(false);
      }
    });
}

}
