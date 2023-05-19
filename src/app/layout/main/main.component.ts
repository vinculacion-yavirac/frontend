import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  sidebar: boolean;

  /* @HostListener('contextmenu', ['$event'])
  onRightClick(event: any) {
    event.preventDefault();
  } */

  ngOnInit() {}

  receiveToggle($event: any) {
    this.sidebar = $event;
  }
}
