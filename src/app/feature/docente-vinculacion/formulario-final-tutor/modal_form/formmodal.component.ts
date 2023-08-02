import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './formmodal.component.html',
  styleUrls: ['./formmodal.component.css']
})

export class FormModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<FormModalComponent>,    private router: Router,
    ) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }
  onSubmit(form: NgForm) {
    localStorage.setItem('observacion' , form.value.observacion )
    this.router.navigate(['/system/docente-vinculacion/formulario-final-tutor/']);

}
}