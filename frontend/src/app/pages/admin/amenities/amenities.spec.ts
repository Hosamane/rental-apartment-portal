import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAmenitiesComponent } from './admin-amenities.component';

describe('Amenities', () => {
  let component: AdminAmenitiesComponent;
  let fixture: ComponentFixture<AdminAmenitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAmenitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAmenitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
