import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'solicitud-tabs',
  templateUrl: './solicitud.tabs.component.html',
  styleUrls: ['./solicitud.tabs.component.css'],
})
export class SolicitudTabsComponent implements OnInit {
  @Input() route: string = '';

  constructor() {}

  ngOnInit(): void {}
}
