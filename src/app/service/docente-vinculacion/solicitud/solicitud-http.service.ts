import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import {ProyectoParticipanteModels} from "../../../models/proyecto/ProjectParticipant/proyecto-participante.moduls";



@Injectable({
  providedIn: 'root'
})
export class SolicitudHttpService {

  constructor(
    private http: HttpClient
  ) { }

  private selectedProjectSubject = new BehaviorSubject<any>(null);
  selectedProject$ = this.selectedProjectSubject.asObservable();

  setSelectedProject(project: any) {
    this.selectedProjectSubject.next(project);
  }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/solicitud';


  //funcion para obtener todas las solicitudes
  public getSolicitud(): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(this.url);
  };

  //Funcion para obtener las solicitudes por el id
  public getSolicitudById(id:number): Observable<SolicitudModels> {
    return this.http.get<SolicitudModels>(`${this.url}/${id}`);
  };

  public searchSolicitudByTerm(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
      );
  };

  public solicitudArchive(id:number): Observable<SolicitudModels>{
    return this.http.put<SolicitudModels>(`${this.url}/archive/${id}`, this.httpOptions);
  };

  public getArchivedSolicitud(): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/archived/list`)
  }

  public searchArchivedSolicitud(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/search/archived/term/${encodeURIComponent(term)}`)
  }

  public restaureSolicitud(id:number): Observable<SolicitudModels>{
    return this.http.put<SolicitudModels>(`${this.url}/restore/${id}`, this.httpOptions)
  }

  public asignarSolicitud(id: number, solicitud: SolicitudModels): Observable<SolicitudModels>{
    return this.http.put<SolicitudModels>(`${this.url}/assign/${id}`, solicitud ,  this.httpOptions);
  }

  public getSolicitudByStatus(status: string): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/filter/status/${status}`);
  }

  public getSolicitudByType(value: string): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/filter/type/${value}`);
  }

  public searchSolicitudeVinculacionByTerm(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/search/type/vinculacion/${encodeURIComponent(term)}`)
  }

  public searchCertificateByTerm(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/search/type/certificado/${encodeURIComponent(term)}`)
  }

  public searchPendienteByTerm(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/search/status/pendiente/${encodeURIComponent(term)}`)
  }

  public searchPreAprobadoByTerm(term:string): Observable<SolicitudModels[]>{
    return this.http.get<SolicitudModels[]>(`${this.url}/search/status/preaprobado/${encodeURIComponent(term)}`)
  }

}
