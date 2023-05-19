import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './shared/notification/notification.service';
import { ToastSuccessComponent } from './shared/notification/toasts/toast-success/toast.component';
import { ToastErrorComponent } from './shared/notification/toasts/toast-error/toast.component';
import { ToastEmailComponent } from './shared/notification/toasts/toast-email/toast.component';
import { ToastAlertComponent } from './shared/notification/toasts/toast-alert/toast.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FDJE_FRONTEND';

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {
    this.notificationService.successStatus.subscribe((message) => {
      snackBar.openFromComponent(ToastSuccessComponent, {
        data: message,
        panelClass: ['snackbar', 'success-snackbar'],
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
    });

    this.notificationService.errorStatus.subscribe((message) => {
      snackBar.openFromComponent(ToastErrorComponent, {
        data: message,
        panelClass: ['snackbar', 'error-snackbar'],
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
    });

    this.notificationService.alertStatus.subscribe((message) => {
      snackBar.openFromComponent(ToastAlertComponent, {
        data: message,
        panelClass: ['snackbar', 'alert-snackbar'],
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
    });

    this.notificationService.emailStatus.subscribe((message) => {
      snackBar.openFromComponent(ToastEmailComponent, {
        data: message,
        panelClass: ['snackbar', 'email-snackbar'],
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
    });
  }
}
