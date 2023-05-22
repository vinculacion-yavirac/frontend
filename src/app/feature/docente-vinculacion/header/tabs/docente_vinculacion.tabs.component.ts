import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'docente_vinculacion-tabs',
  templateUrl: './docente_vinculacion.tabs.component.html',
  styleUrls: ['./docente_vinculacion.tabs.component.css'],
})
export class DocenteVinculacionTabsComponent implements OnInit {
  @Input() route: string = '';

  constructor() {}

  ngOnInit(): void {}
}
