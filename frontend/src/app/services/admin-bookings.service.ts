import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminBookingsService {
  private http = inject(HttpClient);
  // private baseUrl = 
  // 'http://localhost:5000/api/admin/bookings';
private baseUrl = `${environment.apiUrl}/admin/bookings`; 



  // getBookings(status?: string) {
  //   if (status) {
  //     return this.http.get<any[]>(`${this.API}?status=${status}`);
  //   }
  //   return this.http.get<any[]>(this.API);
  // }

getBookings(status?: string) {
  const params: any = {};

  if (status) {
    params.status = status;
  }

  return this.http.get<any>(
    this.baseUrl,
    { params }
  );
}

  approveBooking(id: number) {
    return this.http.put(
      `${this.baseUrl}/${id}/approve`,
      {}
    );
  }

  declineBooking(id: number) {
    return this.http.put(
      `${this.baseUrl}/${id}`,
      { status: 'DECLINED' }
    );
  }
}
