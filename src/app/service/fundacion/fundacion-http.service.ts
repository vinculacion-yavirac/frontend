import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FundacionModels } from 'src/app/models/fundacion/fundacion.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundacionHttpService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/fundacion';


  public getFundaciones(): Observable<FundacionModels[]>{
    return this.http.get<FundacionModels[]>(this.url);
  };
}
