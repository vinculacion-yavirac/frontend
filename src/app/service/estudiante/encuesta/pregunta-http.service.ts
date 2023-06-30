import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';

@Injectable({
  providedIn: 'root'
})
export class PreguntaHttpService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions={
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url: string = "http://127.0.0.1:8000/api";

  getAllP():Observable<PreguntaModel[]> {

    return this.httpClient.get<PreguntaModel[]>(this.url+"/preguntas", this.httpOptions);
  }

  createp(pregunta: PreguntaModel):Observable<PreguntaModel> {

    return this.httpClient.post<PreguntaModel>(this.url+"/preguntas",pregunta, this.httpOptions);
  }
}
