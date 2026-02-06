import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { AdminBookingComponent } from './admin-bookings.component';
import { AdminBookingsComponent } from './admin-bookings.component';
import { BookingStatusComponent } from '../../booking-status/booking-status.component';

describe('Bookings', () => {
  let component: BookingStatusComponent;
  let fixture: ComponentFixture<BookingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
