import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oficio } from './oficio';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class OficiosService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/official-documents';

  // GET /oficios
  public getOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(this.url);
  }

  public addOficio(oficio: Oficio): Observable<Oficio> {
    return this.http.post<Oficio>(
      `${this.url}/create`,
      oficio,
      this.httpOptions
    );
  }

  public searchOficiosByTerm(term: string): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(
      `${this.url}/archived/search/term/${encodeURIComponent(term)}`
    );
  }

  public getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/official_document/${id}`);
  }
}
