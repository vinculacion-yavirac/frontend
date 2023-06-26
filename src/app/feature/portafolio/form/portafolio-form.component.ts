import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { DocumentoHttpService } from '../../../service/portafolio/documento/documento-http.service';
import { DocumentoModels } from '../../../models/portafolio/documentos/documento.models';
import { MyErrorStateMatcher } from '../../../../app/shared/matcher/error-state-matcher';
import { Role } from '../../../models/auth/role/rol';
import {PortafoliosModels} from "../../../models/portafolio/portafolio.models";
import {FilesModels} from "../../../models/portafolio/files/file.models";
import {FileHttpService} from "../../../service/portafolio/files/file-http.service";

@Component({
  selector: 'app-portafolio-form',
  templateUrl: './portafolio-form.component.html',
  styleUrls: ['./portafolio-form.component.css']
})
export class PortafolioFormComponent  {

  briefcaseData: any = {};
  documentData: any = {};
  fileData: any = {};
  documents: DocumentoModels[] = [];

  constructor(private http: HttpClient) {}

  addDocument() {
    const newDocument: DocumentoModels = {
      name: this.documentData.name,
      files: [this.fileData],
    };
    this.documents.push(newDocument);

    // Limpiar los datos
    this.documentData = {};
    this.fileData = {};
  }

  onFileChange(event: any, documentIndex: number) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Verificar si existe `this.documents[documentIndex]`
      if (!this.documents[documentIndex]) {
        this.documents[documentIndex] = {
          files: [{
            name: '',
            content: '',
            file: file
          }]
        };
      } else {
        // Verificar si existe `this.documents[documentIndex].files`
        if (!this.documents[documentIndex].files) {
          this.documents[documentIndex].files = [{
            name: '',
            content: '',
            file: file
          }];
        } else {
          // Verificar si existe `this.documents[documentIndex].files[0]`
          if (this.documents[documentIndex].files[0]) {
            this.documents[documentIndex].files[0].file = file;
          } else {
            this.documents[documentIndex].files[0] = {
              name: '',
              content: '',
              file: file
            };
          }
        }
      }
    }
  }

  createBriefcase() {
    const formData = new FormData();

    // Agregar datos del portafolio
    formData.append('briefcases', JSON.stringify(this.briefcaseData));

    // Agregar documentos y archivos
    this.documents.forEach((document, index) => {
      // Agregar datos del documento
      formData.append(`documents[${index}]`, JSON.stringify(document));

      // Verificar si se seleccionó un archivo
      if (document.files[0].file) {
        const file = document.files[0].file;
        const blob = new Blob([file], { type: file.type });
        formData.append(`files[${index}]`, blob, file.name);
      }
    });

    this.http.post('http://127.0.0.1:8000/api/briefcase/create', formData).subscribe(
        response => {
          // Manejar la respuesta del servidor
          console.log(response);

          // Realizar las acciones necesarias después de crear el portafolio

          // Limpiar los datos
          this.briefcaseData = {};
          this.documents = [];
        },
        error => {
          // Manejar el error en caso de que ocurra
          console.error(error);
        }
    );
  }



  //files
}
