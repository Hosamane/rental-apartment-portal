import { Injectable } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
@Injectable({
  providedIn: 'root',
})
// export class Auth {
  
// }


export class AuthService {

  private API_URL = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<any>(this.getUser());
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      })
    );
  }

  // register(data: any): Observable<any> {
  //   return this.http.post(`${this.API_URL}/register`, data);
  // }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  register(data: { name: string; email: string; password: string }) {
  return this.http.post(`${this.API_URL}/register`, data);
  
}

}