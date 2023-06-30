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
  private url = `${environment.API_URL}/briefcase`;
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  constructor(private http: HttpClient) {}

  // GET /Portafolios
  getBriefcase(): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(this.url);
  }

  // GET /Portafolios id
  getBriefcaseById(id: number): Observable<PortafoliosModels> {
    return this.http.get<PortafoliosModels>(`${this.url}/${id}`);
  }

  // GET /Portafolios archivados
  getArchivedBriefcase(): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(`${this.url}/archived/list`);
  }

  // GET / buscador de Portafolios
  searchBriefcaseByTerm(term: string): Observable<PortafoliosModels[]> {
    const encodedTerm = encodeURIComponent(term.toLowerCase());
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/term/${encodedTerm}`);
  }

  // GET / buscador de Portafolios archivados
  searchArchivedBriefcaseByTerm(term: string): Observable<PortafoliosModels[]> {
    const encodedTerm = encodeURIComponent(term.toLowerCase());
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/archived/term/${encodedTerm}`);
  }

  // GET / buscador de Portafolios por su estado
  filterBriefcaseByStatus(state: string): Observable<PortafoliosModels[]> {
    return this.http.get<PortafoliosModels[]>(`${this.url}/filter/state/${state}`);
  }

  // GET / buscador de Portafolios por su estado aprobado
  searchAprobadoByTerm(term: string): Observable<PortafoliosModels[]> {
    const encodedTerm = encodeURIComponent(term.toLowerCase());
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/state/aprobado/${encodedTerm}`);
  }

  // GET / buscador de Portafolios por su estado pendiente
  searchPendienteByTerm(term: string): Observable<PortafoliosModels[]> {
    const encodedTerm = encodeURIComponent(term.toLowerCase());
    return this.http.get<PortafoliosModels[]>(`${this.url}/search/state/pendiente/${encodedTerm}`);
  }

  // PUT / Archivar portafolio
  archiveBriefcase(id: number): Observable<PortafoliosModels> {
    return this.http.put<PortafoliosModels>(`${this.url}/archive/${id}`, {}, this.httpOptions);
  }

  // PUT / Restarurar portafolio
  restoreBriefcase(id: number): Observable<PortafoliosModels> {
    return this.http.put<PortafoliosModels>(`${this.url}/restore/${id}`, {}, this.httpOptions);
  }

  // POST / Crear portafolio
  addPortafolios(formData: FormData): Observable<PortafoliosModels> {
    return this.http.post<PortafoliosModels>(`${this.url}/create`, formData, this.httpOptions);
  }

  // GET / Obtener comentarios
  getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/briefcaset/${id}`);
  }

  updateBriefcase(id: number, portafolio: PortafoliosModels): Observable<PortafoliosModels> {
    return this.http.put<PortafoliosModels>(`${this.url}/update/${id}`, portafolio, this.httpOptions);
  }

}
