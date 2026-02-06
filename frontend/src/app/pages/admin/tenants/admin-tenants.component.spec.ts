import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTenantsComponent } from './admin-tenants.component';

describe('AdminTenantsComponent', () => {
  let component: AdminTenantsComponent;
  let fixture: ComponentFixture<AdminTenantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTenantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
