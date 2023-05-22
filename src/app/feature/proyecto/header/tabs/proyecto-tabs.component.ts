import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-proyecto-tabs',
  templateUrl: './proyecto-tabs.component.html',
  styleUrls: ['./proyecto-tabs.component.css']
})
export class ProyectoTabsComponent implements OnInit {
  @Input() route: string = '';
  constructor() { }

  ngOnInit(): void {
  }

}
