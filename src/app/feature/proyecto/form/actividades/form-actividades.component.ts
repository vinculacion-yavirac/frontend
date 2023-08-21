import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actividades } from 'src/app/models/proyecto/actividades.models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ProyectoService } from 'src/app/service/proyecto/proyecto.service';
@Component({
  selector: 'app-form-actividades',
  templateUrl: './form-actividades.component.html',
  styleUrls: ['./form-actividades.component.css']
})
export class FormActividadesComponent   implements OnInit {
  form: FormGroup;
  selectedCheckBoxList:any = [];
  selectedCheckBoxList2:any = [];
  selectedCheckBoxList3:any = [];
  selectedCheckBoxList4:any = [];
  public updatedatos: any;
  projectId: number;

  techStackList: any = [
    { id: 1, name: 'Angular', code : 'ANG' },
    { id: 2, name: 'Node JS', code : 'NOD' },
    { id: 3, name: 'React', code : 'REA' },
    { id: 4, name: 'Vue', code : 'VUE' },
    { id: 5, name: 'jQuery', code : 'JQU' }
  ];
  
  constructor(private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,

    ) {
    this.form = this.formBuilder.group({
      technology: this.formBuilder.array([], [Validators.required])

    })
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.projectId = params['id_proyecto'];
      if (this.projectId) { }
      console.log(this.projectId);
  });
  }
    
  controlFrecActivity(e:any) {
    const technologies: FormArray = e.target.id;
  console.log(technologies);
  this.selectedCheckBoxList.push(e.target.id)
  }
  controlActivityVinculation(e:any) {
    const technologies: FormArray = e.target.id;
  console.log(technologies);
  this.selectedCheckBoxList2.push(e.target.id)
  } 
  controlSectorInter(e:any) {
    const technologies: FormArray = e.target.id;
  console.log(technologies);
  this.selectedCheckBoxList3.push(e.target.id)
  }
  controlEstrategicos_vinculacion(e:any) {
    const technologies: FormArray = e.target.id;
  console.log(technologies);
  this.selectedCheckBoxList4.push(e.target.id)
  }
  submit(){
    console.log(JSON.stringify( this.selectedCheckBoxList));

    console.log(JSON.stringify(this.selectedCheckBoxList2));
    console.log(JSON.stringify(this.selectedCheckBoxList3));
    console.log(JSON.stringify(this.selectedCheckBoxList4));
    this.updatedatos = {
      'frequency_activity': JSON.stringify(this.selectedCheckBoxList),
      'activity_vinculation': JSON.stringify(this.selectedCheckBoxList2),
      'intervention_sectors': JSON.stringify(this.selectedCheckBoxList3),
      'linking_activity': JSON.stringify(this.selectedCheckBoxList4),


  };


  this.proyectoService.updateProyectActividades(this.projectId, this.updatedatos).subscribe(async (data: any) => {
    console.log(data);

    if (data.data.proyect != null && data.data.proyect != null) {
        if (data.status === 'success') {
            setTimeout(() => {
                var resultData = data.data.proyect;
                console.log(resultData);

                this.router.navigate(['/system/proyecto']);

            }, 500);
        }
    }
}, async (error) => {
    console.log(error.message);

    // setTimeout(() => {
    // this.router.navigate(['/Home']);
    // }, 500);
});

  }

}
