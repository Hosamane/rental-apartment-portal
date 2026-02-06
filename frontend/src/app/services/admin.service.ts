import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private API = `${environment.apiUrl}/admin`;

  getOverallOccupancy() {
    return this.http.get(`${this.API}/reports/overall-occupancy`);
  }

getTowers() {
  return this.http.get<any[]>(`${this.API}/towers`);
}

createTower(data: { name: string }) {
  return this.http.post(`${this.API}/towers`, data);
}

updateTower(id: number, data: { name: string }) {
  return this.http.put(`${this.API}/towers/${id}`, data);
}

deleteTower(id: number) {
  return this.http.delete(`${this.API}/towers/${id}`);
}
getAmenities() {
  return this.http.get<any[]>(`${environment.apiUrl}/admin/amenities`);
}

getTowerAmenities(towerId: number) {
  return this.http.get<any[]>(
    `${environment.apiUrl}/admin/tower-amenities/${towerId}`
  );
}

saveTowerAmenities(towerId: number, amenityIds: number[]) {
  return this.http.put(
    `${environment.apiUrl}/admin/tower-amenities/${towerId}`,
    { amenity_ids: amenityIds }
  );
}



// getUnits() {
//     return this.http.get<any[]>(this.API);
//   }

//   getUnit(id: number) {
//     return this.http.get<any>(`${this.API}/${id}`);
//   }

//   createUnit(data: any) {
//     return this.http.post(this.API, data);
//   }

//   updateUnit(id: number, data: any) {
//     return this.http.put(`${this.API}/${id}`, data);
//   }

//   deleteUnit(id: number) {
//     return this.http.delete(`${this.API}/${id}`);
//   }
}




