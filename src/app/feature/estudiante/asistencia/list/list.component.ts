import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { UserAuth } from 'src/app/models/auth/user.interface';
import { ActividadesService } from 'src/app/service/actividades/actividades.service';
import { AsistenciaService } from 'src/app/service/asistencia/asistencia.service';
import { AuthHttpService } from 'src/app/service/auth/auth-http.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  asists: any[] = [];
  currentUser = {} as any;

  constructor(
    private asistenciaService: AsistenciaService,
    private authHttpService: AuthHttpService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authHttpService.getUser().subscribe((user: UserAuth) => {
      if (user) {
        this.currentUser = user;
      }
    });

    this.authHttpService.getProfile().subscribe((user: any) => {
      this.currentUser.identity = user.data.user.id;

      this.asistenciaService
        .getAttendances(user.data.user.id)
        .subscribe((res) => {
          this.asists = res.data.map((asistencia: any) => {
            return {
              ...asistencia,
              entry_time: moment(asistencia.entry_time).format('HH:mm'),
              exit_time: moment(asistencia.exit_time).format('HH:mm'),
              created_at: moment(asistencia.created_at).format('YYYY-MM-DD'),
            };
          });
        });
    });
  }

  getTotalHours(entry: any, exit: any) {
    const entryTime = moment(entry, 'HH:mm');
    const exitTime = moment(exit, 'HH:mm');
    const duration = moment.duration(exitTime.diff(entryTime));
    const hours = duration.hours();
    return hours;
  }
}
