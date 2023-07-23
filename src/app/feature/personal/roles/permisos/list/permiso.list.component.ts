import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Permission } from 'src/app/models/auth/permiso/permiso';
import { PermisoHttpService } from 'src/app/service/auth/permiso/permiso-http.service';


@Component({
  selector: 'list-permisos',
  templateUrl: './permiso.list.component.html',
})
export class PermisosListComponent implements OnChanges {
  constructor(private permisoHttpService: PermisoHttpService) {}

  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolId'].currentValue) {
      this.getPermisosByRol(changes['rolId'].currentValue);
    }
  }

  permissions: Permission[] = [];
  @Input() rolId: number;

  public getPermisosByRol(rolId: number): void {
    this.permisoHttpService.getPermisosByRol(rolId).subscribe((res:any) => {
      if (res.status === 'success') {
        this.permissions = res.data.permissions;
      }
      this.loading = false;
    });
  }
}
