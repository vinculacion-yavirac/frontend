import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstitucionBeneficiariaDetalleModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria-detalle.models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstitucionBeneficiariaDetalleHttpService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/fundacionDetalle';


  public getFundacionesDetalle(): Observable<InstitucionBeneficiariaDetalleModels[]>{
    return this.http.get<InstitucionBeneficiariaDetalleModels[]>(this.url);
  };
}
