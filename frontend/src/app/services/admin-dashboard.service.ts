import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private http = inject(HttpClient);
  private BASE = `${environment.apiUrl}/admin`; 
  // 'http://localhost:5000/api/admin';

  getOverallOccupancy() {
    return this.http.get<any>(`${this.BASE}/reports/overall-occupancy`);
  }

  getTowerOccupancy() {
    return this.http.get<any>(`${this.BASE}/reports/occupancy-per-tower`);
  }

  getTowers() {
    return this.http.get<any[]>(`${this.BASE}/towers`);
  }

  getUnits() {
    return this.http.get<any[]>(`${this.BASE}/units`);
  }
}
