import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProyectoModels } from './../../../../models/proyecto/proyecto.models';
import { User } from 'src/app/models/auth/users/usuario';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';

interface Parroquia {

  nombre: string;
}
interface Canton {

  nombre: string;
  parroquias: Parroquia[];
}

interface Provincia {

  nombre: string;
  cantones: Canton[];
}

@Component({
  selector: 'app-form-empresa',
  templateUrl: './form-empresa.component.html',
  styleUrls: ['./form-empresa.component.css']
})

export class FormEmpresaComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectoService,
    private fb: FormBuilder
  ) { }

  provincias = [];
  cantonesMa: Canton[] = [];
  parroquiasMa: Parroquia[] = [];
  cantonesSu: Canton[] = [];
  parroquiasSu: Parroquia[] = [];

  provinciasMapping: Provincia[] = [
    {
      nombre: 'Pichincha',
      cantones: [
        {
          nombre: 'Quito',
          parroquias: [
            { nombre: 'Calderón' },
            { nombre: 'Nono' },
            { nombre: 'Calacalí' }
          ]
        },
        {
          nombre: 'Cayambe',
          parroquias: [
            { nombre: 'Guayllabamba' },
            { nombre: 'Cangahua' }
          ]
        }
      ]
    },
    {
      nombre: 'Guayas',
      cantones: [
        {
          nombre: 'Guayaquil',
          parroquias: [
            { nombre: 'García Moreno' },
            { nombre: 'Chongón' }
          ]
        },
        {
          nombre: 'Durán',
          parroquias: [
            { nombre: 'Divino Niño' },
            { nombre: 'Eloy Alfaro' },
            { nombre: 'El Recreo' }
          ]
        }
      ]
    },
    {
      nombre: 'Manabí',
      cantones: [
        {
          nombre: 'Portoviejo',
          parroquias: [
            { nombre: 'San Pablo' },
            { nombre: 'Francisco Pacheco' }
          ]
        },
        {
          nombre: 'Rocafuerte',
          parroquias: [
            { nombre: 'Rocafuerte' },
            { nombre: 'Pichota' },
            { nombre: 'Chone' }
          ]
        }
      ]
    }
  ];

              getCantones(provId: string) {
                return this.provinciasMapping
                  .filter((prov) => prov.nombre == provId)
                  .map((prov) => prov.cantones)
                  .flat();
              }

              getParroquias(cantonId: string) {
                return this.provinciasMapping
                  .map((prov) => prov.cantones.filter((canton) => cantonId == canton.nombre))
                  .flat()
                  .map((prov) => prov.parroquias)
                  .flat();
              }

              currentEntity= {} as ProyectoModels;

              /*empresaForm = this.fb.group({

                naturalezaRadio: [this.currentEntity.beneficiary_institution_id.management_nature, [Validators.required]],
                numRuc: [this.currentEntity.beneficiary_institution_id.ruc, [Validators.required]],
                actividadEc: [this.currentEntity.beneficiary_institution_id.economic_activity, [Validators.required]],
                correoE: [this.currentEntity.beneficiary_institution_id.email, [Validators.required]],
                telfCo: [this.currentEntity.beneficiary_institution_id.phone, [Validators.required]],
                lugarU: [this.currentEntity.beneficiary_institution_id.place_location, [Validators.required]],
                parroquiaMa: [this.currentEntity.field, [Validators.required]],
                provinciaMa: [this.currentEntity.schedule, [Validators.required]],
                cantonMa: [this.currentEntity.description, [Validators.required]]
                //parroquiaSu: [this.currentEntity.parroquiaSu, [Validators.required]],
                //provinciaSu: [this.currentEntity.provinciaSu, [Validators.required]],
                //cantonSu: [this.currentEntity.cantonSu, [Validators.required]],

              });*/

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        if (params.get("id")){
          this.findById(parseInt(params.get("id")!));
        }
      }
    )
    //this.cantonesMa = this.currentEntity.schedule;
    //this.parroquiasMa[] = this.currentEntity.description;
  }



  onSubmit() {
    if (!this.currentEntity.id) {
      this.createProyecto();
    } else {
      this.updateProyecto();
    }
  }


            selectedCanton: string;


            onChangeProvinciaMatriz(provId: any) {
              this.currentEntity.beneficiary_institution_id.parish_main_id.province = provId.value;
              if (provId) {
                this.cantonesMa = this.getCantones(provId.value);
                this.parroquiasMa = [];
              } else {
                this.cantonesMa = [];
                this.parroquiasMa = [];
              }
              //this.cantonMa?.setValue('');
              //this.parroquiaMa?.setValue('');
            }

            onChangeCantonMatriz(cantonId: any) {
              this.currentEntity.beneficiary_institution_id.parish_main_id.canton = cantonId.value;
              if (cantonId) {
                this.parroquiasMa = this.getParroquias(cantonId.value);
              } else {
                this.parroquiasMa = [];
              }
              //this.parroquiaMa?.setValue('');
            }

            onChangeParroquiaMatriz(parroId: any){
              this.currentEntity.beneficiary_institution_id.parish_main_id.parish = parroId.value;
            }

            onChangeProvinciaSucursal(provId: any) {
              this.currentEntity.beneficiary_institution_id.parish_branch_id.province = provId.value;
              if (provId) {
                this.cantonesSu = this.getCantones(provId.value);
                this.parroquiasSu = [];
              } else {
                this.cantonesSu = [];
                this.parroquiasSu = [];
              }
              //this.cantonSu?.setValue('');
              //this.parroquiaSu?.setValue('');
            }

            onChangeCantonSucursal(cantonId: any) {
              this.currentEntity.beneficiary_institution_id.parish_branch_id.canton = cantonId.value;
              if (cantonId) {
                this.parroquiasSu = this.getParroquias(cantonId.value);
              } else {
                this.parroquiasSu = [];
              }
              //this.parroquiaSu?.setValue('');
            }

            onChangeParroquiaSucursal(parroId: any){
              this.currentEntity.beneficiary_institution_id.parish_branch_id.parish = parroId.value;
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
        this.cantonesMa = this.getCantones(this.currentEntity.beneficiary_institution_id.parish_main_id.province);
        this.parroquiasMa = this.getParroquias(this.currentEntity.beneficiary_institution_id.parish_main_id.canton);
        this.cantonesSu = this.getCantones(this.currentEntity.beneficiary_institution_id.parish_branch_id.province);
        this.parroquiasSu = this.getParroquias(this.currentEntity.beneficiary_institution_id.parish_branch_id.canton);
      }
    )
  }


 /* get naturalezaRadio() {
    return this.empresaForm.get('naturalezaRadio');
  }
  get numRuc() {
    return this.empresaForm.get('numRuc');
  }
  get actividadEc() {
    return this.empresaForm.get('actividadEc');
  }
  get correoE() {
    return this.empresaForm.get('correoE');
  }
  get telfCo() {
    return this.empresaForm.get('telfCo');
  }
  get lugarU() {
    return this.empresaForm.get('lugarU');
  }
  get provinciaMa() {
    return this.empresaForm.get('provinciaMa');
  }
  get cantonMa() {
    return this.empresaForm.get('cantonMa');
  }
  get parroquiaMa() {
    return this.empresaForm.get('parroquiaMa');
  }*/

}
