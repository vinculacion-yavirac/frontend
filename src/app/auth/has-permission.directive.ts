import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[permissions]',
})
export class HasPermissionsDirective {
  @Input() appHasPermissions: string[];
  private hasPermission = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set permissions(values: any) {
    this.appHasPermissions = values;
    this.updateView();
  }

  private updateView() {
    this.hasPermission = this.authService.isAuthorized(this.appHasPermissions);
    if (this.hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
