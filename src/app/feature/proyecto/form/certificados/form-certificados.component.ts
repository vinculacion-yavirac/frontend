import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Certificados } from 'src/app/models/proyecto/certificados.models';

@Component({
  selector: 'app-form-certificados',
  templateUrl: './form-certificados.component.html',
  styleUrls: ['./form-certificados.component.css']
})
export class FormCertificadosComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Certificados =
  {
    certificadosId: 0,
    solicitudes: "",
    portafolio: ""
  };

  ngOnInit(): void {
  }

}
