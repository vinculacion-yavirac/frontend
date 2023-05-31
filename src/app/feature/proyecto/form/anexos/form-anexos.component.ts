import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Anexos } from 'src/app/models/proyecto/anexos.models';


@Component({
  selector: 'app-form-anexos',
  templateUrl: './form-anexos.component.html',
  styleUrls: ['./form-anexos.component.css']
})
export class FormAnexosComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  currentEntity: Anexos =
  {
    anexosId: 0,
    anexose: "",
    anexosi: ""
  };

  ngOnInit(): void {
  }

}
