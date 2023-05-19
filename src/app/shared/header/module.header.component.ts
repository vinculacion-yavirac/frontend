import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'module-header',
  templateUrl: './module.header.component.html',
})
export class ModuleHeaderComponent {
  @Input() title: string;
}
