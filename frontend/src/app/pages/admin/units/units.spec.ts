import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUnitsComponent } from './admin-units.component';

describe('Units', () => {
  let component: AdminUnitsComponent;
  let fixture: ComponentFixture<AdminUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUnitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
