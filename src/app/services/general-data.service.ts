import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GeneralData} from '../model/GeneralData';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralDataService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<GeneralData[]> {
    return this.http.get<GeneralData[]>(`${environment.apiUrl}/api/generaldata`);
  }
}
