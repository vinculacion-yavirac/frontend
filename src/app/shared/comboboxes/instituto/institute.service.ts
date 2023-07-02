import { Injectable } from '@angular/core';
import { InstituteModels } from './institute.models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InstituteService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url = environment.API_URL + '/institute';

  public getInstitute(): Observable<InstituteModels[]>{
    return this.http.get<InstituteModels[]>(this.url);
  };


}
