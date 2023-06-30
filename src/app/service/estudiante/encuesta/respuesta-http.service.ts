import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class RespuestaHttpService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions={
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url: string = "http://127.0.0.1:8000/api";

  getAll():Observable<RespuestaModel[]> {

    return this.httpClient.get<RespuestaModel[]>(this.url+"/respuestas", this.httpOptions);
  }

  create(respuesta: RespuestaModel):Observable<RespuestaModel> {

    return this.httpClient.post<RespuestaModel>(this.url+"/respuestas",respuesta, this.httpOptions);
  }
}
