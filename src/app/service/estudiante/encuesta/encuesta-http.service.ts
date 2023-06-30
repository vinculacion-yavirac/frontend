import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';

@Injectable({
  providedIn: 'root'
})
export class EncuestaHttpService {

  constructor(private httpClient: HttpClient) { }

  private httpOptions={
    headers: new HttpHeaders({"Content-Type":"application/json"})
  }

  private url: string = "http://127.0.0.1:8000/api";

  getAll():Observable<EncuestaModel[]> {

    return this.httpClient.get<EncuestaModel[]>(this.url+"/encuestas", this.httpOptions);
  }

  create(encuesta: EncuestaModel):Observable<EncuestaModel> {

    return this.httpClient.post<EncuestaModel>(this.url+"/encuestas",encuesta, this.httpOptions);
  }

  // ruta para preguntas
  getAllP():Observable<PreguntaModel[]> {

    return this.httpClient.get<PreguntaModel[]>(this.url+"/preguntas", this.httpOptions);
  }

  createAn(pregunta: PreguntaModel):Observable<PreguntaModel> {

    return this.httpClient.post<PreguntaModel>(this.url+"/preguntas",pregunta, this.httpOptions);
  }

  //ruta respuestas
  getAllR():Observable<RespuestaModel[]> {

    return this.httpClient.get<RespuestaModel[]>(this.url+"/respuestas", this.httpOptions);
  }
}
