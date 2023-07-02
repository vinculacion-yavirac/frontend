import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProyectoModels } from './../../../../models/proyecto/proyecto.models';
import { User } from 'src/app/models/auth/users/usuario';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';




@Component({
  selector: 'app-form-empresa',
  templateUrl: './form-empresa.component.html',
  styleUrls: ['./form-empresa.component.css']
})

export class FormEmpresaComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService
  ) { }

  currentEntity = {} as ProyectoModels;

  provincias = [
    {
      nombre: 'Pichincha',
      cantones: [
        {
          nombre: 'Quito',
          parroquias: ['Calderón', 'Nono', 'Calacalí']
        },
        {
          nombre: 'Cayambe',
          parroquias: ['Guayllabamba', 'Cangahua']
        }
      ]
    },
    {
      nombre: 'Guayas',
      cantones: [
        {
          nombre: 'Guayaquil',
          parroquias: ['García Moreno', 'Chongón']
        },
        {
          nombre: 'Durán',
          parroquias: ['Divino Niño', 'Eloy Alfaro', 'El Recreo']
        }
      ]
    },
    {
      nombre: 'Manabí',
      cantones: [
        {
          nombre: 'Portoviejo',
          parroquias: ['San Pablo', 'Francisco Pacheco']
        },
        {
          nombre: 'Rocafuerte',
          parroquias: ['Rocafuerte', 'Pichota', 'Chone']
        }
      ]
    }
  ];

   parroquias = [
    {
      nombre: 'Rocafuerte',
      ciudad: 'Rocafuerte',
      pais: 'Manabí'
    },
    {
      nombre: 'Pichota',
      ciudad: 'Rocafuerte',
      pais: 'Manabí'
    },
    {
      nombre: 'Chone',
      ciudad: 'Rocafuerte',
      pais: 'Manabí'
    },
    {
      nombre: 'San Pablo',
      ciudad: 'Portoviejo',
      pais: 'Manabí'
    },
    {
      nombre: 'Francisco Pacheco',
      ciudad: 'Portoviejo',
      pais: 'Manabí'
    },
    {
      nombre: 'Divino Niño',
      ciudad: 'Durán',
      pais: 'Guayas'
    },
    {
      nombre: 'Eloy Alfaro',
      ciudad: 'Durán',
      pais: 'Guayas'
    },
    {
      nombre: 'El Recreo',
      ciudad: 'Durán',
      pais: 'Guayas'
    },
    {
      nombre: 'García Moreno',
      ciudad: 'Guayaquil',
      pais: 'Guayas'
    },
    {
      nombre: 'Chongón',
      ciudad: 'Guayaquil',
      pais: 'Guayas'
    },
    {
      nombre: 'Guayllabamba',
      ciudad: 'Cayambe',
      pais: 'Pichincha'
    },
    {
      nombre: 'Cangahua',
      ciudad: 'Cayambe',
      pais: 'Pichincha'
    },
    {
      nombre: 'Calderón',
      ciudad: 'Quito',
      pais: 'Pichincha'
    },
    {
      nombre: 'Nono',
      ciudad: 'Quito',
      pais: 'Pichincha'
    },
    {
      nombre: 'Calacalí',
      ciudad: 'Quito',
      pais: 'Pichincha'
    }
  ];


  selectedProvincia: string;
  selectedCanton: string;
  selectedParroquia: string;

  onProvinciaChange(provincia: string) {
    this.selectedCanton = '';
    this.selectedParroquia = '';
    const selectedProvinciaData = provincias.find(item => item.nombre === provincia);
    this.cantones = selectedProvinciaData ? selectedProvinciaData.cantones : [];
  }

  onCantonChange(canton: string) {
    this.selectedParroquia = '';
    const selectedCantonData = cantones.find(item => item.nombre === canton);
    this.parroquias = selectedCantonData ? selectedCantonData.parroquias : [];
  }

  onParroquiaChange(parroquia: string) {
    const selectedParroquiaData = parroquias.find(item => item.nombre === parroquia);
    if (selectedParroquiaData) {
      this.selectedCanton = selectedParroquiaData.canton;
      this.selectedProvincia = selectedParroquiaData.pais;
    } else {
      this.selectedCanton = '';
      this.selectedProvincia = '';
    }
  }





  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        if (params.get("id")){
          this.findById(parseInt(params.get("id")!));
        }
      }
    )
  }


  onSubmit() {
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
        console.log(response);
      }
    )
  }

}
