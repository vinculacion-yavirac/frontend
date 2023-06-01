import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actividades } from 'src/app/models/proyecto/actividades.models';

@Component({
  selector: 'app-form-actividades',
  templateUrl: './form-actividades.component.html',
  styleUrls: ['./form-actividades.component.css']
})
export class FormActividadesComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Actividades =
  {
          actividadesId: 0,
          frecuencia: "",
          sectores: "",
          vinculacion: "",
          ejes: ""
  };

  ngOnInit(): void {
  }

}
