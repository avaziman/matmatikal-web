import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRegisterWeb } from '../api_bindings/UserRegisterWeb';

export function api_url(path: string) {
  return new URL(path, API_ENDPOINT).href;
}

const API_ENDPOINT = "http://localhost:8080";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }


  api_url(s: string) {
    return api_url(`/auth/${s}`);
  }

  google_login(jwt: string): Observable<any> {
    return this.http.post(this.api_url("google-login"), jwt, {withCredentials: true});
  }

  get_birthday(code: string, gid: string): Observable<any> {
    let params = new HttpParams()
      .set('code', code)
      .set('google_id', gid);

    return this.http.get(this.api_url("birthday"), { params });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.api_url("login"), { email, password }, {withCredentials: true });
  }

  register(register_data: UserRegisterWeb): Observable<any> {
    return this.http.post(this.api_url("register"), register_data);
  }
}
