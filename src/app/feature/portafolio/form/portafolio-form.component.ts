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
  files:FilesModels[] =[];

  constructor(private http: HttpClient) {}

  addDocument() {
    const newDocument = { ...this.documentData, files: [this.fileData] };
    this.documents.push(newDocument);

    // Limpiar los datos
    this.documentData = {};
    this.fileData = {};
  }

  createBriefcase() {
    const data = {
      briefcases: this.briefcaseData,
      documents: this.documents
    };

    this.http.post('http://127.0.0.1:8000/api/briefcase/create', data).subscribe(
        (response: any) => {
          const createdBriefcaseId = response.document.id;
          console.log(createdBriefcaseId + ' createdBriefcaseId');

          // Asignar el ID del portafolio en la tabla files
          if (createdBriefcaseId) {
            this.documents.forEach(document => {
              document.files.forEach(file => {
                file.briefcase_id = createdBriefcaseId;
              });
            });
          }

          console.log(data);
          // Realizar las acciones necesarias después de crear el portafolio
        },
        error => {
          console.error(error);
          // Manejar el error en caso de que ocurra
        }
    );
  }


  //files
}
