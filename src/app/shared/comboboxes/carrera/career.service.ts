import { Injectable } from '@angular/core';
import { CareerModels } from './career.models';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CareerService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url = environment.API_URL + '/career';

  public getCareer(): Observable<CareerModels[]>{
    return this.http.get<CareerModels[]>(this.url);
  };


}
