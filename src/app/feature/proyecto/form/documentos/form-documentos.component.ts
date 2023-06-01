import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Documentos } from 'src/app/models/proyecto/documentos.models';

@Component({
  selector: 'app-form-documentos',
  templateUrl: './form-documentos.component.html',
  styleUrls: ['./form-documentos.component.css']
})
export class FormDocumentosComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Documentos =
  {
          documentosId: 0,
          documentosA: ""
  };

  ngOnInit(): void {
  }

}
