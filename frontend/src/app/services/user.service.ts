import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}`;

getTowers() {
  return this.http.get<any[]>(
   `${this.API}/user/towers`
  );
}



  getUnits(params: any = {}) {
    return this.http.get<any[]>(`${this.API}/user/units`, { params });
  }

  bookUnit(data: any) {
    return this.http.post(`${this.API}/user/bookings`, data);
  }

  getBookings(params: any = {}) {
  return this.http.get<any[]>(
    `${this.API}/user/bookings`,
    { params }
  );
}

updateProfile(data: any) {
  return this.http.put(
    `${this.API}/user/profile`,
    data
  );
}
getProfile() {
  return this.http.get<any>(
    `${this.API}/user/profile`
  );
}

logout() {
  localStorage.removeItem('access-token');
  localStorage.removeItem('user');
}




}
