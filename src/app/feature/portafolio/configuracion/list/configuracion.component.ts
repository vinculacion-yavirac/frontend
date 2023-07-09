import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Role } from 'src/app/models/auth/role/rol';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { DocumentoHttpService } from 'src/app/service/portafolio/documento/documento-http.service';
import { ModalConfiguracionComponent } from '../modal-configuracion/modal-configuracion.component';
import { switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit{

  documentForm: FormGroup;
  loading: boolean = true;
  reverse = false;
  documentos: DocumentoModels[] = [];
  documentFormOpened = false;
  roles:Role[] =[];
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(
    private documentoHttpService: DocumentoHttpService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getDocumentos();
  }

  openModal(): void {
    const dialogRef = this.dialog.open(ModalConfiguracionComponent, {
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


  openModalToUpdate(documento: DocumentoModels): void {
    const dialogRef = this.dialog.open(ModalConfiguracionComponent, {
      height: '500px',
      width: '1300px',
      data: { documento: { ...documento } } // Pasar una copia del objeto documento al componente de contenido del modal
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // Realizar acciones después de cerrar el modal (por ejemplo, actualizar la lista de documentos)
        // result contendrá la copia del objeto documento actualizado con los cambios
        // Aquí puedes actualizar la lista de documentos si es necesario
      }
    });
  }

  getRoleFromDocumento(documento: DocumentoModels): Role | undefined {
    return typeof documento.responsible_id === 'number' ? this.getRoleById(documento.responsible_id) : documento.responsible_id;
  }
  getRoleById(responsible_id: number): Role | undefined {
    throw new Error('Method not implemented.');
  }

  searchDocumentoByTerm(term: string): void {
    this.documentoHttpService
      .searchDocumentsByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }


  archiveDocument(documento:DocumentoModels): void {
    this.documentoHttpService.archiveDocument(documento.id).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          console.log('archive id');
        }
      }),
      switchMap(() => this.router.navigate(['/system/portafolio/configuracion/archived']))
    ).subscribe();
  }


  openDialogArchiveDocumento(documento: DocumentoModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar este Documento ?',
        message:
          'El documento será archivado y no podrá ser utilizado por los usuarios.',
        dato:['Nombre:', documento.name],
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveDocument(documento);
      }
    });
  }
  
  
}
