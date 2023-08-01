import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './formmodal.component.html',
  styleUrls: ['./formmodal.component.css']
})

export class FormModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormModalComponent>) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

}