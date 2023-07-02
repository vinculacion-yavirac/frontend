import { Injectable } from '@angular/core';
import { SchoolPeriodModels } from './school-period.models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SchoolPeriodService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url = environment.API_URL + '/school-period';

  public getSchoolPeriod(): Observable<SchoolPeriodModels[]>{
    return this.http.get<SchoolPeriodModels[]>(this.url);
  };


}
