import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortafoliosModels } from '../../../app/models/portafolio/portafolio.models';
import { environment } from '../../../environments/environment';
import {SolicitudModels} from "../../models/docente-vinculacion/solicitud/solicitud";

@Injectable({
  providedIn: 'root'
})
export class PortafolioHttpService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/briefcase';

  // GET /Portafolios
  public getPortafolios(): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(this.url);
  };

  public addPortafolios(PortafoliosModels: PortafoliosModels): Observable<PortafoliosModels> {
    return this.http.post<PortafoliosModels>(
      `${this.url}/create`,
      PortafoliosModels,
      this.httpOptions
    );
  };

  public searchPortafoliosByTerm(term: string): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
    );
  };

  public getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/briefcaset/${id}`);
  };

  public filterBriefcaseByStatus(state: string): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(`${this.url}/filter/state/${state}`);
  };

  public searchAprobadoByTerm(term:string): Observable<PortafoliosModels[]>{
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/state/aprobado/${encodeURIComponent(term)}`);
  };

  public searchPendienteByTerm(term:string): Observable<PortafoliosModels[]>{
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/state/pendiente/${encodeURIComponent(term)}`);
  };

  public getArchivedBriefcase(): Observable<PortafoliosModels[]>{
    return this.http.get<PortafoliosModels[]>(`${this.url}/archived/list`);
  };

  public searchArchivedBriefcaseByTerm(term:string): Observable<PortafoliosModels[]>{
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/archived/term/${encodeURIComponent(term)}`);
  };

  public archiveBriefcase(id:number): Observable<PortafoliosModels>{
    return this.http.put<PortafoliosModels>(`${this.url}/archive/${id}`, this.httpOptions);
  };

  public restaureBriefcase(id:number): Observable<PortafoliosModels>{
    return this.http.put<PortafoliosModels>(`${this.url}/restore/${id}`, this.httpOptions);
  };
}
