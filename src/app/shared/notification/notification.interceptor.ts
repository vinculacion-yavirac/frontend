import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Location } from '@angular/common';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private location: Location
  ) {}

  redirectUrl = '/error';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.notificationService.showLoading();

    return next.handle(req).pipe(
      tap(
        (event: any) => {
          if (event.body && event.body.message) {
            if (event.status === 200 || event.status === 201) {
              if (event.body.status === 'email') {
                this.notificationService.showEmail(event.body.message);
                return;
              }
              this.notificationService.showSuccess(event.body.message);
            }
          }
        },
        (error) => {
          if (error.status === 403) {
            this.notificationService.showError(
              'No tienes permisos para realizar esta acción'
            );
            this.location.back();
          } else if (error.status === 0) {
            this.notificationService.showError(
              'Algo inesperado a ocurrido con el servidor'
            );
          } else if (error.error.status === 'alert') {
            this.notificationService.showAlert(error.error.message);
          } else if (error.error.message) {
            this.notificationService.showError(error.error.message);
          }
        }
      ),
      finalize(() => {
        this.notificationService.hideLoading();
      })
    );
  }
}
