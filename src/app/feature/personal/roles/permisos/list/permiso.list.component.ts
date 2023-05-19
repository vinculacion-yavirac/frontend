import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PermissionService } from '../permiso.service';
import { Permission } from '../permiso';


@Component({
  selector: 'list-permisos',
  templateUrl: './permiso.list.component.html',
})
export class PermisosListComponent implements OnChanges {
  constructor(private permissionService: PermissionService) {}

  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolId'].currentValue) {
      this.getPermisosByRol(changes['rolId'].currentValue);
    }
  }

  permissions: Permission[] = [];
  @Input() rolId: number;

  public getPermisosByRol(rolId: number): void {
    this.permissionService.getPermisosByRol(rolId).subscribe((res:any) => {
      if (res.status === 'success') {
        this.permissions = res.data.permissions;
      }
      this.loading = false;
    });
  }
}
