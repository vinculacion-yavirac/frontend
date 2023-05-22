import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'estudiante-tabs',
  templateUrl: './estudiante.tabs.component.html',
  styleUrls: ['./estudiante.tabs.component.css'],
})
export class EstudianteTabsComponent implements OnInit {
  @Input() route: string = '';

  constructor() {}

  ngOnInit(): void {}
}
