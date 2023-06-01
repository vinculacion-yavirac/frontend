import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firmas } from 'src/app/models/proyecto/firmas.models';

@Component({
  selector: 'app-form-firmas',
  templateUrl: './form-firmas.component.html',
  styleUrls: ['./form-firmas.component.css']
})
export class FormFirmasComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Firmas =
  {
    firmasId: 0,
    numero: "",
    cargo: "",
    nombre: "",
    cedula: ""
  };

  ngOnInit(): void {
  }

}
