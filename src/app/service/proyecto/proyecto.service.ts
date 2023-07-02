import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProyectoModels } from '../../../app/models/proyecto/proyecto.models';
import { environment } from '../../../environments/environment';
import {SolicitudModels} from "../../models/docente-vinculacion/solicitud/solicitud";

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

  public addProyecto(proyectoModels: ProyectoModels): Observable<ProyectoModels> {
    return this.http.post<ProyectoModels>(
      `${this.url}/create`,
      proyectoModels,
      this.httpOptions
    );
  }

  public updateProyecto(proyectoModels: ProyectoModels): Observable<ProyectoModels> {
    return this.http.put<ProyectoModels>(
      `${this.url}/update/${proyectoModels.id}`,
      proyectoModels,
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

  public getProjectByFoundation(foundationId: number): Observable<ProyectoModels[]> {
    return this.http.get<ProyectoModels[]>(`${this.url}/foundation/${foundationId}`);
  }

  public getProjectById(id: number): Observable<ProyectoModels[]> {
    return this.http.get<ProyectoModels[]>(`${this.url}/${id}`);
  }
}
