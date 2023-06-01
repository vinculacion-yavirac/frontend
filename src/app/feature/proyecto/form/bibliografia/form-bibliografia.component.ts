import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Bibliografia } from 'src/app/models/proyecto/bibliografia.models';

@Component({
  selector: 'app-form-bibliografia',
  templateUrl: './form-bibliografia.component.html',
  styleUrls: ['./form-bibliografia.component.css']
})
export class FormBibliografiaComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Bibliografia =
  {
    bibliografiaId: 0,
    numEstrategia: "",
    estrategias: "",
    numBibliografia: "",
    bibliografias: ""
  };

  ngOnInit(): void {
  }

}
