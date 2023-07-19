import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/auth/users/usuario';
import { SolicitudModels } from 'src/app/models/docente-vinculacion/solicitud/solicitud';
import { ProyectoModels } from 'src/app/models/proyecto/proyecto.models';

@Component({
  selector: 'app-list-estudiante',
  templateUrl: './list-estudiante.component.html',
  styleUrls: ['./list-estudiante.component.css']
})
export class ListEstudianteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
  }

}