import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProyectoModels } from './../../../../models/proyecto/proyecto.models';
import { User } from 'src/app/models/auth/users/usuario';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';


@Component({
  selector: 'app-form-datos-generales',
  templateUrl: './form-datos-generales.component.html',
  styleUrls: ['./form-datos-generales.component.css']
})
export class FormDatosGeneralesComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(
      (params) => {
        if (params.get("id")){
          this.findById(parseInt(params.get("id")!));
        }
      }
    )

  }

    currentEntity= {} as ProyectoModels;


    onSubmit(): void {
      if (!this.currentEntity.id) {
        this.createProyecto();
      } else {
        this.updateProyecto();
      }
    }

    createProyecto() {
      this.proyectoService.addProyecto(this.currentEntity).subscribe((res: any) => {
        if (res.status == 'success') {
          this.router.navigate(['system/proyecto/list']);
        }
      });
    }

    updateProyecto() {
      this.proyectoService.updateProyecto(this.currentEntity).subscribe((res: any) => {
      });
    }

    findById(id: number):void {
      this.proyectoService.getProjectById(id).subscribe(
        (response:any) => {
          this.currentEntity = response.data.projects;
        }
      )
    }

    isIdDefined(): boolean {
      return !!this.currentEntity.id;
    }

}
