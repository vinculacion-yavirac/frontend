import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { Role } from 'src/app/models/auth/role/rol';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { RolHttpService } from 'src/app/service/auth/role/rol-http.service';
import { DocumentoHttpService } from 'src/app/service/portafolio/documento/documento-http.service';

@Component({
  selector: 'app-modal-configuracion',
  templateUrl: './modal-configuracion.component.html',
  styleUrls: ['./modal-configuracion.component.css']
})
export class ModalConfiguracionComponent implements OnInit {


  documentForm: FormGroup;
  roles: Role[] = [];
  selectedRole: Role | undefined;
  loading: boolean = true;
  reverse = false;
  documentos: DocumentoModels[] = [];
  documentFormOpened = false;
  title = 'Crear Documentos';
  documento: DocumentoModels;
  isUpdateMode: boolean = false;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private documentoHttpService: DocumentoHttpService,
    private rolHttpService: RolHttpService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { documento: DocumentoModels },
    private dialogRef: MatDialogRef<ModalConfiguracionComponent>
  ) {this.documento = { ...data.documento };}

  ngOnInit() {
    this.getDocumentos();
    this.getRoles();
    this.documentForm = this.formBuilder.group({
      documents: this.formBuilder.array([])
    });

    if (this.data && this.data.documento) {
      this.isUpdateMode = true;
      const documento = this.data.documento;
      this.title = 'Actualizar Documentos';
      // Agrega los form controls al FormArray 'documents'
      const documentGroup = this.formBuilder.group({
        name: [documento.name, Validators.required],
        template: [documento.template, Validators.required],
        state: [documento.state, Validators.required],
        order: [documento.order, Validators.required],
        responsible_id: [typeof documento.responsible_id === 'number' ? documento.responsible_id : documento.responsible_id?.id]
      });
      this.documents.push(documentGroup);
    } else {
      // Agrega un form control inicial al FormArray 'documents'
      this.addDocument();
    }
  }

  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }

  getRoles(): void {
    this.loading = true;
    this.rolHttpService.getRoles().subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
      this.loading = false;
    });
  }

  selectRole(event: any) {
    const roleId = event.target.value;
    this.selectedRole = this.roles.find((role) => role.id === roleId);
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
      responsible_id: [this.selectedRole?.id]
    });

    this.documents.push(documentGroup); // Agregar al final del array
    this.documentFormOpened = true;
  }


  updateDocuments(): void {
    if (this.documentForm.invalid) {
     // this.getDocumentos();
      this.router.navigate(['/system/portafolio/configuracion']);
      return;
    }
  
    this.documento = {
      ...this.documento,
      ...this.documentForm.value.documents[0]
    };
  
    this.documentoHttpService.updateDocuments(this.documento).subscribe(
      response => {
        this.dialogRef.close(this.documento);
        window.location.reload();
      },
      error => {
        console.error('Error al actualizar el documento:', error);
      }
    );
  }


  removeDocument(index: number) {
    this.documents.removeAt(index);
    this.documentFormOpened = false;
  }

  submitForm() {
    if (this.isUpdateMode) {
      this.updateDocuments();
    } else {
      this.createDocuments();
    }
  }


  createDocuments(){
    const documents = this.documentForm.value.documents;
    this.documentoHttpService.addDocuments(documents).subscribe(
      response => {
        this.changeDetectorRef.detectChanges(); // Realizar una nueva detección de cambios
        window.location.reload(); // Recargar la página
      },
      error => {
        console.error('Error al crear los documentos:', error);
      }
    );
  }

  reversOrder(): void {
    this.documentos.reverse();
    this.reverse = !this.reverse;
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.documentos = res.data.documents;
      this.reverse = false;
    }
    this.loading = false;
  }

  getDocumentos(): void {
    this.loading = true;
    this.documentoHttpService.getDocuments().subscribe((res: any) => {
      this.handleSearchResponse(res);
      this.loading = false;
    });
  }

  sortPortafolio(): void {
    this.documentos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }
}