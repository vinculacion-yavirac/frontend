import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'oficios-tabs',
  templateUrl: './oficios.tabs.component.html',
  styleUrls: ['./oficios.tabs.component.css'],
})
export class OficiosTabsComponent implements OnInit {
  @Input() route: string = '';

  constructor() {}

  ngOnInit(): void {}
}
