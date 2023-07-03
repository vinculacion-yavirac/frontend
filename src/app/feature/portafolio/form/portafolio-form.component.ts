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
import { ActivatedRoute, Params, Router } from '@angular/router';

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
  // files: File [] = [];
  title = 'Portafolio';
  files: CustomFile[] = [];

info:PortafoliosModels;

  paramsSubscription: Subscription;
  idPortafolio:number;
  constructor(
    private formBuilder: FormBuilder,
    private portafolioHttpService: PortafolioHttpService,
    private documentosHtppService: DocumentoHttpService,
    private fileHttpService: FileHttpService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.initForm();
  }

  // ngOnInit(): void {
  //   this.getDocumentos();
  // }

  ngOnInit(): void {
    // this.buildForm();
    this.getDocumentos();
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.title = 'Portafoliossssss';
        this. getBriefcaseId(params['id']);
      } else {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });

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



  getBriefcaseId(id:number){
    this.portafolioHttpService.getBriefcaseById(id).subscribe((response:any) =>{
      if(response.status === 'success'){
        this.info = response.data.briefcases;
        console.log('entraaaaaaa', this.info);
      }
    })
  }




  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  onSubmit(): void {
    if (this.briefcaseForm.valid) {
      console.log('success valid');
      this.createBriefcase(); 
      // this.uploadFiles(1,1);
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


  createBriefcase(): void {
    if (this.briefcaseForm.valid) {
      this.portafolioHttpService.addPortafolios(this.currentPortafolio).subscribe((response: any) => {

        if(response.status === 'success'){
        console.log('createBriefcase:',this.currentPortafolio);
        const id = response.data.briefcase.id;
        console.log('idsssssss',1)
        this.uploadFiles(id);
        }
      });
    } else {
      console.log('error');
    }
  }

  uploadFiles(idPortafolio:number): void {
    if (this.selectedDocumento) {
      this.fileHttpService.uploadFiles(this.files,idPortafolio);
    }
  }

  // onFileSelected(event: any): void {
  //   this.files = Array.from(event.target.files);
  //   console.log(this.files);
  //   this.updateSelectedFilesList();
  // }


  onFileSelected(event: any, documento: DocumentoModels): void {
    this.selectedDocumento = documento;
    const selectedFiles: FileList = event.target.files;
  
    // Limpiar el array this.files
    //this.files = [];
  
    // Recorrer los archivos seleccionados y agregarlos al array this.files
    for (let i = 0; i < selectedFiles.length; i++) {
      const file: File = selectedFiles[i];
      const customFile: CustomFile = {
        file: file,
        document_id: documento.id
      }
      this.files.push(customFile);
    }
  
    console.log(this.files);
    this.updateSelectedFilesList();
  }

  updateSelectedFilesList(): void {
    this.cdr.detectChanges();
  }


  // downloadFile(idPortafolio: number,idDocument:number,idFile:number, name: string) {
  //   this.fileHttpService.downloadFile(idPortafolio,idDocument,idFile).subscribe((blob: Blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = name;
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       window.URL.revokeObjectURL(url);
  //   });
  // }


  downloadFile(portafolioId: number, documentoId: number, fileId: number, fileName: string) {
    this.fileHttpService.downloadFile(portafolioId, documentoId, fileId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
