import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/login';  

  constructor(private http: HttpClient) { }

  // Función para hacer login
  // authService.ts
  login(email: string, password: string): Observable<any> {
    const body = { 
      email: email, 
      contrasena: password  
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

}
