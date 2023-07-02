import { Injectable } from '@angular/core';
import { ResponsibleModels } from './responsible.models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url = environment.API_URL + '/responsible';

  public getResponsible(): Observable<ResponsibleModels[]>{
    return this.http.get<ResponsibleModels[]>(this.url);
  };


}
