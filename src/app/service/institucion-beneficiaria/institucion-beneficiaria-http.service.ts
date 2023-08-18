import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstitucionBeneficiariaModels } from 'src/app/models/institucion-beneficiaria/institucion-beneficiaria.models';
import { environment } from 'src/environments/environment';

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

  getArchivedInstitucion(): Observable<InstitucionBeneficiariaModels[]> {
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/archived/list`);
  }

  public filterInstitucionesBeneficiariaByStatus(state: string): Observable<InstitucionBeneficiariaModels[]> {
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/filter/state/${state}`);
  };

  public searchInstitucionesBeneficiariaByTerm(term: string): Observable<InstitucionBeneficiariaModels[]> {
    return this.http.get<InstitucionBeneficiariaModels[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
    );
  };

  public createInstitucionesBeneficiariaBy(InstitucionBeneficiariaModels: InstitucionBeneficiariaModels): Observable<InstitucionBeneficiariaModels> {
    return this.http.post<InstitucionBeneficiariaModels>(`${this.url}/create`,InstitucionBeneficiariaModels,this.httpOptions);
  };

  public searchInactivaByTerm(term:string): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/search/state/inactivo/${encodeURIComponent(term)}`);
  };

  public searchAprobadoByTerm(term:string): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/search/state/activo/${encodeURIComponent(term)}`);
  };

  public getAllProjectParticipants(): Observable<InstitucionBeneficiariaModels[]>{
    return this.http.get<InstitucionBeneficiariaModels[]>(this.url);
  };

  searchArchivedInstitucionByTerm(term: string): Observable<InstitucionBeneficiariaModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<InstitucionBeneficiariaModels[]>(`${this.url}/search/archived/term/${encodedTerm}`);
  }

  archiveInstitucion(id: number): Observable<InstitucionBeneficiariaModels> {
    return this.http.put<InstitucionBeneficiariaModels>(`${this.url}/archive/${id}`, null, this.httpOptions);
  }

  restoreInstitucion(id: number): Observable<InstitucionBeneficiariaModels> {
    return this.http.put<InstitucionBeneficiariaModels>(`${this.url}/restore/${id}`, null, this.httpOptions);
  }

  deleteInstitucion(id: number): Observable<InstitucionBeneficiariaModels> {
    return this.http.delete<InstitucionBeneficiariaModels>(`${this.url}/delete/${id}`, this.httpOptions);
  }
}
