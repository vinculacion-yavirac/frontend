import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnInit {
  constructor() {}

  @Output() pageBoundsCorrection: EventEmitter<number>;
  @Input() id: string;
  @Input() config: {
    itemsPerPage: number;
    currentPage: number;
  };

  ngOnInit(): void {}

  pageChange(event: any) {
    this.config.currentPage = event;
  }
}
