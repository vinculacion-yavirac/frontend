import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs-fundacion',
  templateUrl: './tabs-fundacion.component.html',
  styleUrls: ['./tabs-fundacion.component.css']
})
export class TabsFundacionComponent implements OnInit {
  
  @Input() route: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
