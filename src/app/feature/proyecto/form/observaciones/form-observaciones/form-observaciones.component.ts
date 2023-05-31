import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observaciones } from 'src/app/models/proyecto/observaciones.models';

@Component({
  selector: 'app-form-observaciones',
  templateUrl: './form-observaciones.component.html',
  styleUrls: ['./form-observaciones.component.css']
})
export class FormObservacionesComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  currentEntity: Observaciones = {
    observacionesId: 0,
    estado: '',
    observacioness: '',
  };

  observacionesForm = this.fb.group({
    estado: this.fb.group({
      estadoRadio: [this.currentEntity.estado, [Validators.required]],
    }),
    observaciones: [this.currentEntity.observacioness, [Validators.required]],
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.table(this.currentEntity);
  }

  get estado() {
    return this.observacionesForm.get('estado');
  }

  get observaciones() {
    return this.observacionesForm.get('observaciones');
  }

  get estadoRadio() {
    return this.observacionesForm.get('estado')?.value.estadoRadio;
  }


}
