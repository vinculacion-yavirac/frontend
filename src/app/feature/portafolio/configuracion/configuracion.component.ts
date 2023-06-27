import { Component, OnInit } from '@angular/core';
import {DocumentoHttpService} from "../../../service/portafolio/documento/documento-http.service";
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  documentForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private documentoHttpService: DocumentoHttpService) {}

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      documents: this.formBuilder.array([])
    });
  }

  get documents(): FormArray {
    return this.documentForm.get('documents') as FormArray;
  }

  addDocument() {
    const documentGroup = this.formBuilder.group({
      name: ['', Validators.required],
      template: ['', Validators.required],
      state: [true, Validators.required],
      order: ['', Validators.required],
      responsible_id: ['']
    });

    this.documents.push(documentGroup);
  }

  removeDocument(index: number) {
    this.documents.removeAt(index);
  }

  submitForm() {
    if (this.documentForm.invalid) {
      return;
    }

    const documents = this.documentForm.value.documents;

    this.documentoHttpService.addDocuments(documents)
      .subscribe(
        response => {
          console.log('Documentos creados exitosamente.');
        },
        error => {
          console.error('Error al crear los documentos:', error);
        }
      );
  }
}
