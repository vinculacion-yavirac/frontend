import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-configuracion-tabs',
  templateUrl: './configuracion-tabs.component.html',
  styleUrls: ['./configuracion-tabs.component.css']
})
export class ConfiguracionTabsComponent implements OnInit {
  @Input() route: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
