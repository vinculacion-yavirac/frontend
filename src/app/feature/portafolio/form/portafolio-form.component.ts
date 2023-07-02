import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { CustomFile } from 'src/app/models/portafolio/files/custom-file.interface';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { DocumentoHttpService } from 'src/app/service/portafolio/documento/documento-http.service';
import { FileHttpService } from 'src/app/service/portafolio/files/file-http.service';
import { Subscription } from 'rxjs';
import { FilesModels } from 'src/app/models/portafolio/files/file.models';

@Component({
  selector: 'app-portafolio-form',
  templateUrl: './portafolio-form.component.html',
  styleUrls: ['./portafolio-form.component.css']
})
export class PortafolioFormComponent implements OnInit, OnDestroy {
  selectedDocumento?: DocumentoModels;
  briefcaseForm: FormGroup;
  currentPortafolio = {} as PortafoliosModels;
  loading = true;
  selectedFiles: File[] = [];
  documentos: DocumentoModels[] = [];
  project: ProyectoParticipanteModels;
  files: File [] = [];
  paramsSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private portafolioHttpService: PortafolioHttpService,
    private documentosHtppService: DocumentoHttpService,
    private fileHttpService: FileHttpService,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getDocumentos();
  }

  initForm(): void {
    this.briefcaseForm = this.formBuilder.group({
      observations: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
          ],
        },
      ],
      state: [
        '',
        {
          validators: [
            Validators.required,
          ],
        },
      ],
      // files: [
      //   [],
      //   {
      //     validators: [Validators.required],
      //   },
      // ],
    });

    this.briefcaseForm.valueChanges.subscribe((values) => {
      this.currentPortafolio = values;
      console.log('this.currentPortafolio:', this.currentPortafolio);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.briefcaseForm.valid) {
      console.log('success valid');
      this.createBriefcase(); 
      this.uploadFiles(1,1);
    } else {
      console.log('error');
    }
  }

  getDocumentos(): void {
    this.loading = true;
    this.documentosHtppService.getDocuments().subscribe((res: any) => {
      if (res.status === 'success') {
        this.documentos = res.data.documents;
        console.log(this.documentos);
      }
      this.loading = false;
    });
  }

  selectDocumento(event: any): void {
    const selectedValue = event.target.value;
    const selectedDocument = this.documentos.find((document) => document.id === parseInt(selectedValue));
    this.selectedDocumento = selectedDocument;
  }

  getSelectedDocumentId(): number | undefined {
    return this.selectedDocumento?.id;
  }

  createBriefcase(): void {
    if (this.briefcaseForm.valid) {
      this.portafolioHttpService.addPortafolios(this.currentPortafolio).subscribe((response: any) => {

        if(response.status === 'success'){
          const idPortafolio = response.data.briefcase.id;
        const idDocumento = this.getSelectedDocumentId() || 1;

        console.log('createBriefcase:',this.currentPortafolio)
        // Pasar los archivos al servicio para subirlos
        this.uploadFiles(idPortafolio, idDocumento); 
        }
      });
    } else {
      console.log('error');
    }
  }

  uploadFiles(idPortafolio: number, idDocumento: number): void {
    this.fileHttpService.uploadFiles(this.files, idPortafolio, idDocumento);
  }

  // onFileSelected(event: any): void {
  //   this.files = Array.from(event.target.files);
  //   console.log(this.files);
  //   this.updateSelectedFilesList();
  // }


  onFileSelected(event: any): void {
    const selectedFiles: FileList = event.target.files;
  
    // Recorrer los archivos seleccionados y agregarlos al array this.files
    for (let i = 0; i < selectedFiles.length; i++) {
      const file: File = selectedFiles[i];
      this.files.push(file);
    }
  
    console.log(this.files);
    this.updateSelectedFilesList();
  }

  updateSelectedFilesList(): void {
    this.cdr.detectChanges();
  }
}
