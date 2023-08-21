import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthHttpService } from '../auth/auth-http.service';
import { UserAuth } from 'src/app/models/auth/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private url = `${environment.API_URL}/attendances`;
  currentUser = {} as any;

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getAttendances(id: number): Observable<any> {
    console.log('aqui', id);

    return this.http.get(this.url, { params: { user_id: id } });
  }
}
