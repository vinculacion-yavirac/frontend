import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs-institucion-beneficiaria',
  templateUrl: './tabs-institucion-beneficiaria.component.html',
  styleUrls: ['./tabs-institucion-beneficiaria.component.css']
})
export class TabsInstitucionBeneficiariaComponent implements OnInit {

  @Input() route: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
