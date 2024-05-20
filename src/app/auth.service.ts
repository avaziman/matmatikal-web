import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_ENDPOINT = "http://localhost:3000";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private api_url(path: string) {
    return new URL(path, API_ENDPOINT).href;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.api_url("/auth/login"), { email, pass: password });
  }
}
