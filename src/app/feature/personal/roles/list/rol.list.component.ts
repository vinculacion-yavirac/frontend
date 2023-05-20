import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from '../../../../../app/shared/material/modal-alert/modal-alert.component';
import { MatAccordion } from '@angular/material/expansion';
import { Role } from 'src/app/models/auth/role/rol';
import { RolHttpService } from 'src/app/service/auth/role/rol-http.service';

@Component({
  selector: 'app-rol-list',
  templateUrl: './rol.list.component.html',
  styleUrls: ['./rol.list.component.css'],
})
export class RolesListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  panelOpenState = false;
  loading = true;

  constructor(private RolHttpService: RolHttpService, private dialog: MatDialog) {}

  roles: Role[] = [];

  ngOnInit(): void {
    this.getRoles();
  }

  public getRoles(): void {
    this.loading = true;
    this.RolHttpService.getRoles().subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
      this.loading = false;
    });
  }

  public searchRolesByTerm(term: string): void {
    this.RolHttpService.searchRolesByTerm(term).subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
    });
    if (term === '') {
      this.getRoles();
    }
  }

  public archiveRol(rol: Role): void {
    this.RolHttpService.archiveRol(rol.id).subscribe((res: any) => {
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
