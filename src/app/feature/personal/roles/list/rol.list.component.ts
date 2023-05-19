import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from '../rol';
import { RolService } from '../rol.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol.list.component.html',
  styleUrls: ['./rol.list.component.css'],
})
export class RolesListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = false;
  loading = true;

  constructor(private rolService: RolService, private dialog: MatDialog) {}

  roles: Role[] = [];

  ngOnInit(): void {
    this.getRoles();
  }

  public getRoles(): void {
    this.loading = true;
    this.rolService.getRoles().subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
      this.loading = false;
    });
  }

  public searchRolesByTerm(term: string): void {
    this.rolService.searchRolesByTerm(term).subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
    });
    if (term === '') {
      this.getRoles();
    }
  }

  public archiveRol(rol: Role): void {
    this.rolService.archiveRol(rol.id).subscribe((res: any) => {
      if (res.status == 'success') {
        this.getRoles();
      }
    });
  }

  public openDialogArchiveRol(rol: Role): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de archivar el rol?',
        message:
          'El rol será archivado y no podrá ser utilizado por los usuarios.',
        dato: rol.name,
        button: 'Archivar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveRol(rol);
      }
    });
  }
}
