import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortafoliosModels } from '../../../app/models/portafolio/portafolio.models';
import { environment } from '../../../environments/environment';
import { CustomFile } from 'src/app/models/portafolio/files/custom-file.interface';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';

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
  addPortafolios(data: PortafoliosModels): Observable<any> {
    return this.http.post<any>(`${this.url}/create`, data, this.httpOptions);
  }

  // GET / Obtener comentarios
  getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/briefcaset/${id}`);
  }

  updateBriefcase(id: number, portafolio: PortafoliosModels): Observable<PortafoliosModels> {
    return this.http.put<PortafoliosModels>(`${this.url}/update/${id}`, portafolio, this.httpOptions);
  }

  uploadFiles(files: CustomFile[], idBriefcase: number): void {
    const formData = new FormData();

    files.forEach((file: CustomFile) => {
      formData.append('files[]', file.file);
      formData.append('names[]', file.file.name);
      formData.append('types[]', file.file.type);
      formData.append('document_ids[]', file.document_id.toString());
      formData.append('created_at[]',file.created_at.toString());
      formData.append('observation[]',file.observation);
      formData.append('state[]',file.state.toString());
    });

    this.http.post(`${this.url}/upload/${idBriefcase}`, formData).subscribe(
      (response: any) => {
        console.log('Archivos enviados correctamente');
      },
      (error: any) => {
        console.error('Error al enviar los archivos:', error);
      }
    );
  }

  deleteBriefcase(id: number): Observable<PortafoliosModels> {
    return this.http.delete<PortafoliosModels>(`${this.url}/delete/${id}`, this.httpOptions);
  }

  updatePortafolio(id: number, data: any): Observable<PortafoliosModels> {
    return this.http.put<PortafoliosModels>(`${this.url}/update/${id}`, data, this.httpOptions);
  }

}
