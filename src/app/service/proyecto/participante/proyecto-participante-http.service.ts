import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {ProyectoModels} from "../../../models/proyecto/proyecto.models";
import {ProyectoParticipanteModels} from "../../../models/proyecto/ProjectParticipant/proyecto-participante.moduls";

@Injectable({
  providedIn: 'root'
})
export class ProyectoParticipanteHttpService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/participant';

  public getProyectoParticipante(): Observable<ProyectoParticipanteModels[]> {
    return this.http.get<ProyectoParticipanteModels[]>(this.url);
  }
}
