import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';




@Injectable({
  providedIn: 'root'
})
export class SolicitudHttpService {

  setSelectedProject(selectedProject: import("../../../models/proyecto/proyecto.models").ProyectoModels | undefined) {
    throw new Error("Method not implemented.");
  }

  constructor(
    private http: HttpClient
  ) { }


  private url = `${environment.API_URL}/solicitud`;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getSolicitudes(): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(this.url);
  }

  getSolicitudeById(id: number): Observable<SolicitudModels> {
    return this.http.get<SolicitudModels>(`${this.url}/${id}`);
  }

  getArchivedSolicitude(): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/archived/list`);
  }

  searchSolicitudeByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/term/${encodedTerm}`);
  }

  searchArchivedSolicitudeByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/archived/term/${encodedTerm}`);
  }

  filterSolicitudeByValue(value: string): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/filter/value/${value}`);
  }

  filterSolicitudeByStatus(status: string): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/filter/status/${status}`);
  }

  searchSolicitudeVinculacionByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/type/vinculacion/${encodedTerm}`);
  }

  searchCertificateByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/type/certificado/${encodedTerm}`);
  }

  searchPendienteByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/status/pendiente/${encodedTerm}`);
  }

  searchAprobadoByTerm(term: string): Observable<SolicitudModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<SolicitudModels[]>(`${this.url}/search/status/aprobado/${encodedTerm}`);
  }

  archiveSolicitud(id: number): Observable<SolicitudModels> {
    return this.http.put<SolicitudModels>(`${this.url}/archive/${id}`, null, this.httpOptions);
  }

  restoreSolicitud(id: number): Observable<SolicitudModels> {
    return this.http.put<SolicitudModels>(`${this.url}/restore/${id}`, null, this.httpOptions);
  }

  assignSolicitude(id: number, solicitud: SolicitudModels): Observable<SolicitudModels> {
    return this.http.put<SolicitudModels>(`${this.url}/assign/${id}`, solicitud, this.httpOptions);
  }

  aprovateCertificado(id: number): Observable<SolicitudModels> {
    return this.http.put<SolicitudModels>(`${this.url}/aprovate-certificado/${id}`,null, this.httpOptions);
  }

  disapproveCertificate(id: number): Observable<SolicitudModels> {
    return this.http.put<SolicitudModels>(`${this.url}/disapprove-certificate/${id}`,null, this.httpOptions);
  }

  deleteSolicitud(id: number): Observable<SolicitudModels> {
    return this.http.delete<SolicitudModels>(`${this.url}/delete/${id}`, this.httpOptions);
  }

  //ESTUDIANTE

  getSolicitudesStudent(): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(`${this.url}/student/list`);
  }

  createSolicitudeVinculacion(solicitud: SolicitudModels): Observable<SolicitudModels> {
    return this.http.post<SolicitudModels>(`${this.url}/create/solictud/vinculacion`, solicitud, this.httpOptions);
  }

  createCertificadoVinculacion(solicitud: SolicitudModels): Observable<SolicitudModels> {
    return this.http.post<SolicitudModels>(`${this.url}/create/solictud/certificado`, solicitud, this.httpOptions);
  }

  getSolicitudeCertificadoAprobado(): Observable<SolicitudModels> {
    return this.http.get<SolicitudModels>(`${this.url}/list/certificate`);
  }
}
