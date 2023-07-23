import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { PortafolioHttpService } from 'src/app/service/portafolio/portafolio-http.service';
import { HttpClient } from '@angular/common/http';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { FileHttpService } from 'src/app/service/portafolio/files/file-http.service';

@Component({
  selector: 'app-portafolio-tutor',
  templateUrl: './portafolio-tutor.component.html',
  styleUrls: ['./portafolio-tutor.component.css']
})
export class PortafolioTutorComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  portafolios: PortafoliosModels[] = [];
  loading = true;
  filterAprobado: boolean;
  filterPendiente: boolean;
  projectParticipants : ProyectoParticipanteModels [] = [];
  participantIds: number[] = [];

  constructor(
    private portafolioHttpService: PortafolioHttpService,
    private fileHttpService: FileHttpService,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.route.data.subscribe((data: any) => {
      this.filterAprobado = data.filterAprobado;
      this.filterPendiente = data.filterPendiente;
    });
  }

  ngOnInit(): void {
    this.getAllProjectParticipantsTutor();
    if (this.filterAprobado === true) {
      this.filterBriefcaseByState(this.filterAprobado.toString());
    } else if (this.filterPendiente === false) {
      this.filterBriefcaseByState(this.filterPendiente.toString());
    } else {
      this.getPortafolio();
    }
  }

  searchPortafoliosByTerm(term: string): void {
    this.loading = true;

    if (!term) {
      this.handleEmptyTerm();
    } else if (this.filterPendiente === false) {
      this.searchPendienteByTerm(term);
    } else if (this.filterAprobado === true) {
      this.searchAprobadoByTerm(term);
    } else {
      this.searchPortafolioByTerm(term);
    }
  }

  handleEmptyTerm(): void {
    if (this.filterPendiente === false) {
      this.filterBriefcaseByState(this.filterPendiente.toString());
    } else if (this.filterAprobado === true) {
      this.filterBriefcaseByState(this.filterAprobado.toString());
    } else {
      this.getPortafolio();
    }
  }

  filterBriefcaseByState(state: string): void {
    this.loading = true;
    this.portafolioHttpService
      .filterBriefcaseByStatus(state)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
        this.loading = false;
      });
  }

  getPortafolio(): void {
    this.loading = true;
    this.portafolioHttpService.getBriefcase().subscribe((res: any) => {
      if (res.status === 'success') {
        const allPortafolios: PortafoliosModels[] = res.data.briefcases;

        // Obtener los participant_ids del resultado anterior
        const participantIds: number[] = this.projectParticipants.map((projectParticipant: ProyectoParticipanteModels) => {
          return projectParticipant.participant_id.id;
        });

        // Filtrar los portafolios donde created_by sea igual a uno de los participant_ids
        this.portafolios = allPortafolios.filter((portafolio: PortafoliosModels) => {
          return participantIds.includes(portafolio.created_by.id);
        });

        this.reverse = false;
      }
      this.loading = false;
    });
  }

  searchPortafolioByTerm(term: string): void {
    this.portafolioHttpService
      .searchBriefcaseByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  searchPendienteByTerm(term: string): void {
    this.portafolioHttpService
      .searchPendienteByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  searchAprobadoByTerm(term: string): void {
    this.portafolioHttpService
      .searchAprobadoByTerm(term)
      .subscribe((res: any) => {
        this.handleSearchResponse(res);
      });
  }

  reversOrder(): void {
    this.portafolios.reverse();
    this.reverse = !this.reverse;
  }

  downloadFile(portafolioId: number, documentoId: number, fileId: number, fileName: string) {
    this.fileHttpService.downloadFile(portafolioId, documentoId, fileId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortPortafolio(): void {
    this.portafolios.sort((a, b) => {
      return a.created_by.person.names.toLowerCase().localeCompare(b.created_by.person.names.toLowerCase());
    });
  }

  private getAllProjectParticipantsTutor(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/project-participant/lista';
    this.http.get<any>(apiUrl).subscribe((res: any) => {
      if (res.status === 'success') {
        const uniqueProjectParticipants: ProyectoParticipanteModels[] = res.data.projectParticipants;

        // Imprimir todos los participant_id por consola
        uniqueProjectParticipants.forEach((projectParticipant: ProyectoParticipanteModels) => {
        });

        this.projectParticipants = uniqueProjectParticipants;
      }
      this.loading = false;
    });
  }
}
