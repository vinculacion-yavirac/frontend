import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DocumentoHttpService } from "../../../service/portafolio/documento/documento-http.service";
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Role } from "../../../models/auth/role/rol";
import { RolHttpService } from "../../../service/auth/role/rol-http.service";
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { ModalConfiguracionComponent } from '../modal-configuracion/modal-configuracion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, AfterViewInit {

  documentForm: FormGroup;
  roles: Role[] = [];
  selectedRole: Role | undefined;
  loading: boolean = true;
  reverse = false;
  documentos: DocumentoModels[] = [];
  documentFormOpened = false;
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  dialog: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private formBuilder: FormBuilder,
    private documentoHttpService: DocumentoHttpService,
    private rolHttpService: RolHttpService,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.getDocumentos();
    this.documentForm = this.formBuilder.group({
      documents: this.formBuilder.array([])
    });

    this.getRoles();
  }

  //--------------
  openModal(): void {
    const dialogRef = this.dialogo.open(ModalConfiguracionComponent, {
      height: '500px',
      width: '1300px',
      data: { /* datos que deseas pasar al componente de contenido del modal */ }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal
      }
    });
  }


  //---------------

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


  removeDocument(index: number) {
    this.documents.removeAt(index);
    this.documentFormOpened = false;
  }

  submitForm() {
    if (this.documentForm.invalid) {
      return;
    }

    const documents = this.documentForm.value.documents;

    this.documentoHttpService.addDocuments(documents).subscribe(
      response => {
        console.log('Documentos creados exitosamente.');
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
