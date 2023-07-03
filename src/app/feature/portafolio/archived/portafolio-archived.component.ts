import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PortafoliosModels } from '../../../../app/models/portafolio/portafolio.models';
import { FileHttpService } from '../../../../app/service/portafolio/files/file-http.service';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { finalize } from 'rxjs/operators';
import {Router} from "@angular/router";

@Component({
  selector: 'app-portafolio-archived',
  templateUrl: './portafolio-archived.component.html',
  styleUrls: ['./portafolio-archived.component.css']
})
export class PortafolioArchivedComponent implements OnInit {
  reverse = false;
  pipe = new DatePipe('en-US');
  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };
  portafolios: PortafoliosModels[] = [];
  loading = true;

  constructor(
      private portafolioHttpService: PortafolioHttpService,
      private fileHttpService: FileHttpService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.getPortafolios();
  }

  getPortafolios(): void {
    this.loading = true;
    this.portafolioHttpService.getArchivedBriefcase().subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
      }
      this.loading = false;
    });
  }

  searchPortafoliosByTerm(term: string): void {
    this.loading = true;

    if (term === '') {
      this.getPortafolios();
    } else {
      this.portafolioHttpService.searchArchivedBriefcaseByTerm(term).subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
          this.reverse = false;
        }
        this.loading = false;
      });
    }
  }

  reversOrder(): void {
    this.portafolios.reverse();
    this.reverse = !this.reverse;
  }

  // downloadFile(id: number, name: string): void {
  //   this.fileHttpService.downloadFile(id).subscribe((blob: Blob) => {
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = name;
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   });
  // }

  handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.portafolios = res.data.briefcases;
      this.reverse = false;
    }
    this.loading = false;
  }

  sortSolicitudes(): void {
    this.portafolios.sort((a, b) => {
      return a.project_participant_id.participant_id.person.identification
          .toLowerCase()
          .localeCompare(b.project_participant_id.participant_id.person.identification.toLowerCase());
    });
  }

  restaurePortafolio(briefcase: PortafoliosModels): void {
    this.portafolioHttpService.restoreBriefcase(briefcase.id)
        .subscribe((res: any) => {
          if (res.portafolios.status === 'success') {
            this.handleSearchResponse(res);
          }
          this.router.navigate(['/system/portafolio/list']);
        });
  }
}
