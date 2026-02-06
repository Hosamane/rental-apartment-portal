import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminAmenitiesService {
  private http = inject(HttpClient);

  private API = `${environment.apiUrl}/admin/amenities`;
  
  getAmenities() {
    return this.http.get<any[]>(this.API);
  }

  createAmenity(data: { name: string }) {
    return this.http.post(this.API, data);
  }

  updateAmenity(id: number, data: { name: string }) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteAmenity(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
