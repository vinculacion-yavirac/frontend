import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-portafolio-tabs',
  templateUrl: './portafolio-tabs.component.html',
  styleUrls: ['./portafolio-tabs.component.css']
})
export class PortafolioTabsComponent implements OnInit {
  @Input() route: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
