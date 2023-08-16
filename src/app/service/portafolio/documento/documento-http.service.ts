import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DocumentoModels} from "../../../models/portafolio/documentos/documento.models";

@Injectable({
  providedIn: 'root'
})
export class DocumentoHttpService {

  private url = `${environment.API_URL}/document`;
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
  };

  constructor(private http: HttpClient) {}

  // GET /Documentos
  getDocuments(): Observable<DocumentoModels[]> {
    return this.http.get<DocumentoModels[]>(this.url);
  }

  getArchivedDocument(): Observable<DocumentoModels[]> {
    return this.http.get<DocumentoModels[]>(`${this.url}/archived/list`);
  }

  addDocuments(documento: DocumentoModels): Observable<DocumentoModels> {
    return this.http.post<DocumentoModels>(`${this.url}/create`, documento, this.httpOptions);
  }

  public updateDocuments(documento: DocumentoModels): Observable<DocumentoModels> {
    return this.http.put<DocumentoModels>(
      `${this.url}/update/${documento.id}`,
      documento,
      this.httpOptions
    );
  }

  getDocumentById(id: number): Observable<DocumentoModels> {
    return this.http.get<DocumentoModels>(`${this.url}/${id}`);
  }

  getDocumentsByResponsibleStudent(): Observable<DocumentoModels[]> {
    return this.http.get<DocumentoModels[]>(`${this.url}/responsible/student`);
  }

  getDocumentsByResponsibleTutorandStuden(): Observable<DocumentoModels[]> {
    return this.http.get<DocumentoModels[]>(`${this.url}/responsible/tutorstuden`);
  }

  // GET / buscador de Documentos
  searchDocumentsByTerm(term: string): Observable<DocumentoModels[]> {
    const encodedTerm = encodeURIComponent(term.toLowerCase());
    return this.http.get<DocumentoModels[]>(`${this.url}/search/term/${encodedTerm}`);
  }

  searchArchivedDocumentByTerm(term: string): Observable<DocumentoModels[]> {
    const encodedTerm = encodeURIComponent(term);
    return this.http.get<DocumentoModels[]>(`${this.url}/search/archived/term/${encodedTerm}`);
  }

  archiveDocument(id: number): Observable<DocumentoModels> {
    return this.http.put<DocumentoModels>(`${this.url}/archive/${id}`, null, this.httpOptions);
  }

  restoreDocument(id: number): Observable<DocumentoModels> {
    return this.http.put<DocumentoModels>(`${this.url}/restore/${id}`, null, this.httpOptions);
  }
}
