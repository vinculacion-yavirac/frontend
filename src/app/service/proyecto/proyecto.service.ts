import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectoModels } from '../../../app/models/proyecto/proyecto.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/project';

  // GET /Proyecto
  public getProyecto(): Observable<ProyectoModels[]> {
    return this.http.get<ProyectoModels[]>(this.url);
  }

  public addProyecto(ProyectoModels: ProyectoModels): Observable<ProyectoModels> {
    return this.http.post<ProyectoModels>(
      `${this.url}/create`,
      ProyectoModels,
      this.httpOptions
    );
  }

  public searchProyectoByTerm(term: string): Observable<ProyectoModels[]> {
    return this.http.get<ProyectoModels[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
    );
  }

  public getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/briefcaset/${id}`);
  }
}
