import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import moment from 'moment';
import { AsistenciaService } from 'src/app/service/asistencia/asistencia.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  fecha: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private asisService: AsistenciaService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fecha = new Date(params['date']);
      console.log(this.fecha);
    });
  }

  init: string;
  exit: string;
  activities: string;
  initTs: Date;
  exitTs: Date;
  asists: any[];

  setInit() {
    this.initTs = new Date();
    this.init = moment(this.initTs).format('HH:mm:ss');
  }

  setExit() {
    this.exitTs = new Date();
    this.exit = moment(this.exitTs).format('HH:mm:ss');
  }

  getDate(item: any) {
    return moment(item).format('YYYY-MM-DD');
  }

  getHour(item: any) {
    return moment(item).format('HH:mm');
  }

  getDifferenceHours(init: any, exit: any) {
    const result = moment(init).diff(exit);
    return moment.duration(result).asHours().toFixed(2);
  }

  create() {
    const data = {
      user_id: 4,
      entry_time: this.initTs,
      exit_time: this.exitTs,
      observation: this.activities,
    };
    this.asisService.create(data).subscribe((res) => {
      this.init = '';
      this.exit = '';
      this.activities = '';
      this.router.navigate(['system/estudiante/asistencia'])
    });
  }
}
