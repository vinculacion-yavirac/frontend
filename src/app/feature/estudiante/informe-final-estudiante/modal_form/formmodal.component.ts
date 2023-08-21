import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './formmodal.component.html',
  styleUrls: ['./formmodal.component.css']
})

export class FormModalComponent2 implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormModalComponent2>,    private router: Router,
    ) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }
  onSubmit(form: NgForm) {
    localStorage.setItem('avanze' , form.value.observacion )
    localStorage.setItem('result' , form.value.observacion )

    localStorage.setItem('alcance' , form.value.observacion )
    localStorage.setItem('observacion' , form.value.observacion )

    this.router.navigate(['/system/estudiante/informe-final-estudiante/']);

}
}