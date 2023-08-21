import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css'],
})
export class AsistenciaComponent implements OnInit {
  events: [] = [];
  calendarOptions: CalendarOptions = {
    locale: esLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    weekends: false,
    dateClick: this.handleEventClick.bind(this),
    events: this.events,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  handleEventClick(arg: any) {
    console.log(arg);

    this.router.navigate([
      '/system/estudiante/asistencia/create',
      { date: arg.dateStr },
    ]);
  }
}
