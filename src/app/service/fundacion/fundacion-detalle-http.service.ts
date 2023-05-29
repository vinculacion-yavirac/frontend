import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FundacionDetalleModels } from 'src/app/models/fundacion/fundacion-detalle.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundacionDetalleHttpService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/fundacionDetalle';


  public getFundacionesDetalle(): Observable<FundacionDetalleModels[]>{
    return this.http.get<FundacionDetalleModels[]>(this.url);
  };
}
