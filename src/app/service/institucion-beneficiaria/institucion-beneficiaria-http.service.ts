import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { environment } from 'src/environments/environment';
import {PortafoliosModels} from "../../models/portafolio/portafolio.models";

@Injectable({
  providedIn: 'root'
})
export class InstitucionBeneficiariaHttpService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/beneficiary-institution';


  public getInstitucionesBeneficiarias(): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(this.url);
  };

  public filterInstitucionesBeneficiariaByStatus(state: string): Observable<InstitucionBeneficiariaModels[]> {
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/filter/state/${state}`);
  };

  public searchInstitucionesBeneficiariaByTerm(term: string): Observable<InstitucionBeneficiariaModels[]> {
    return this.http.get<InstitucionBeneficiariaModels[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
    );
  };

  public searchInactivaByTerm(term:string): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/search/state/inactivo/${encodeURIComponent(term)}`);
  };

  public searchAprobadoByTerm(term:string): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/search/state/activo/${encodeURIComponent(term)}`);
  };
}
