import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api_url } from './auth.service';
import { Observable } from 'rxjs';
import { Sketch } from '../api_bindings/Sketch';
import { UploadWeb } from '../api_bindings/UploadWeb';

interface SketchData {
  functions: [],
}

@Injectable({
  providedIn: 'root'
})
export class SketchService {

  constructor(private http: HttpClient) { }

  api_url(s: string) {
    return api_url(`/sketches/${s}`);
  }

  upload(uploadData: UploadWeb): Observable<number> {
    return this.http.post<number>(this.api_url("upload"), uploadData, { withCredentials: true });
  }

  explore(): Observable<{ [groupName: string]: Sketch[] }> {
    return this.http.get<{ [groupName: string]: Sketch[] }>(this.api_url("explore"), { withCredentials: true });
  }

  delete(sketchId: number): Observable<void> {
    return this.http.delete<void>(this.api_url(`delete/${sketchId}`), { withCredentials: true });
  }
}
