import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTowersComponent } from './admin-towers.component';

describe('Towers', () => {
  let component: AdminTowersComponent;
  let fixture: ComponentFixture<AdminTowersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTowersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
