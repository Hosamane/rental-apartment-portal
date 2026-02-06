import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminUnitsService {
  private http = inject(HttpClient);
  private API =`${environment.apiUrl}/admin/units`; 
  // 'http://localhost:5000/api/admin/units';
  private towers = `${environment.apiUrl}/admin/towers`;

  getUnits() {
    return this.http.get<any[]>(this.API);
  }

  getUnit(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  createUnit(data: any) {
    return this.http.post(this.API, data);
  }

  updateUnit(id: number, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteUnit(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  getTowers(){
    return this.http.get<any[]>(this.towers);
  }
}
