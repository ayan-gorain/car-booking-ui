import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Main {

  private baseUrl = 'http://13.201.4.37:8080';
  private authUrl = `${this.baseUrl}/api/v1/auth`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, data);
  }

  getUserById(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    return this.http.get(`${this.baseUrl}/api/v1/users/${userId}`, { headers });
  }

  login(data: LoginRequest): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, data);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken') || '';
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.http.post(`${this.authUrl}/logout`, { refreshToken }, { headers });
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.authUrl}/refresh`, { refreshToken });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email });
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password`, data);
  }

  // New: fetch logged-in user profile
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    return this.http.get(`${this.baseUrl}/api/v1/users/me`, { headers });
  }

  // New: update logged-in user profile
  updateUserProfile(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
    return this.http.put(`${this.baseUrl}/api/v1/users/me`, data, { headers });
  }
}
  