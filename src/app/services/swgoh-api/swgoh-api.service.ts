import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwgohApiService {
  private baseUrl = 'https://swgoh.gg/api';

  constructor(private http: HttpClient) { }

  getUnits(): Observable<any> {
    return this.http.get(`${this.baseUrl}/units/`);
  }

  getCharacters(): Observable<any> {
    return this.http.get(`${this.baseUrl}/characters/`);
  }

  getShips(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ships/`);
  }

  // Add more methods for other API endpoints as needed
}
