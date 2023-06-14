import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ProyectoService} from "../../../../service/proyecto/proyecto.service";
import {ProyectoModels} from "../../../../models/proyecto/proyecto.models";
import {InstitucionBeneficiariaModels} from "../../../../models/institucion-beneficiaria/institucion-beneficiaria.models";

@Component({
  selector: 'app-proyecto-info',
  templateUrl: './proyecto-info.component.html',
  styleUrls: ['./proyecto-info.component.css']
})
export class ProyectoInfoComponent implements OnChanges {

  constructor(private proyectoHttpService: ProyectoService) {}

  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['foundationId'].currentValue) {
      this.getProjectByFoundation(changes['foundationId'].currentValue);
      console.log('entra if'+''+changes['foundationId'].currentValue );

    }else {
      console.log('entra else'+''+changes['foundationId'].currentValue  );
    }
  }

  project:InstitucionBeneficiariaModels[] = [];
  @Input() foundationId: number;

  public getProjectByFoundation(foundationId: number): void {
    this.proyectoHttpService.getProjectByFoundation(foundationId).subscribe((res:any) => {
      if (res.status === 'success') {
        const projects = res.data.project;
        console.log(res.data.project);
        if (Array.isArray(projects)) {
          this.project = projects;
          console.log('entra error get'+''+this.project);
        } else {
          // Manejo de error: la respuesta no contiene un array de proyectos
        }
      }
      this.loading = false;
    });
  }

}
