import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';


@Injectable({
  providedIn: 'root'
})
export class SolicitudHttpService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/solicitud';

  public getSolicitud(): Observable<SolicitudModels[]> {
    return this.http.get<SolicitudModels[]>(this.url);
  }

}
