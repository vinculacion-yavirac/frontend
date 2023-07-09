import { Component, OnInit } from '@angular/core';
import { DocumentoHttpService } from "../../../service/portafolio/documento/documento-http.service";
import { FormGroup } from '@angular/forms';
import { Role } from "../../../models/auth/role/rol";
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { ModalConfiguracionComponent } from '../modal-configuracion/modal-configuracion.component';
import { MatDialog } from '@angular/material/dialog';

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
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  constructor(
    private documentoHttpService: DocumentoHttpService,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.getDocumentos();
  }

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
    const dialogRef = this.dialogo.open(ModalConfiguracionComponent, {
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
  
  
}
