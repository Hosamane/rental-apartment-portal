import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminTenantsService {
  private http = inject(HttpClient);
  private API =`${environment.apiUrl}/admin/tenants`; 
  // 'http://localhost:5000/api/admin/tenants';

  // getTenants(filters: any = {}) {
  //   let params = new HttpParams();

  //   Object.keys(filters).forEach(key => {
  //     if (filters[key] !== null && filters[key] !== '') {
  //       params = params.set(key, filters[key]);
  //     }
  //   });


  getTenants(params: any) {
  return this.http.get<any>(
    `${this.API}`,
    { params }
  );



    return this.http.get<any>(this.API, { params });
  }



  getTowers() {
  return this.http.get<any[]>(`${environment.apiUrl}/admin/towers`);
}

getUnitsByTower(towerId: number) {
  return this.http.get<any[]>(
   `${environment.apiUrl}/admin/units`,
    { params: { tower_id: towerId } }
  );
}

}
