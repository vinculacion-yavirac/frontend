import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectoModels } from '../../../models/proyecto/proyecto.models';
import { ProyectoService } from '../../../service/proyecto/proyecto.service';
import {switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalAlertComponent} from "../../../shared/material/modal-alert/modal-alert.component";
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-proyecto-list',
  templateUrl: './proyecto-list.component.html',
  styleUrls: ['./proyecto-list.component.css']
})
export class ProyectoListComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  proyectos: ProyectoModels[] = [];

  loading: boolean = true;
  constructor(
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getProject();
  }

  public getProject(): void {
    this.loading = true;
    this.proyectoService.getProyecto().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
        this.sortProjects();
      }
      this.loading = false;
    });
  }

  public searchProjectByTerms(term: string): void {
    this.loading = true;
    this.proyectoService.searchProjectByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        console.log(this.proyectos);
        if (term === '') {
          this.getProject();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.proyectos.reverse();
    this.reverse = !this.reverse;
  }

  public archiveProject(proyecto:ProyectoModels): void {
    this.proyectoService.archiveProject(proyecto.id).pipe(
      tap((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          console.log('archive id');
        }
      }),
      switchMap(() => this.router.navigate(['/system/proyecto/list/archived']))
    ).subscribe();
  }



  public openDialogArchiveProject(proyecto:ProyectoModels): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar esta solicitud?',
        message:
          'La solicitud será archivado y no podrá ser utilizado por los usuarios.',
        dato:['Nombre:', proyecto.name , 'Tipo de solicitud:', proyecto.name],
        // dato: solicitud.type_of_request,
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveProject(proyecto);
      }
    });
  }


  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.proyectos = res.data.projects;
      this.reverse = false;
    }
    this.loading = false;
  }

  public sortProjects(): void {
    this.proyectos.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

}
