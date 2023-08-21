import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-coincidencia-modal',
  templateUrl: './coincidencia-modal.component.html',
  styleUrls: ['./coincidencia-modal.component.css']
})
export class CoincidenciaModalComponent implements OnInit {

  projectParticipants: any;
  projectParticipantsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  participantId: number;
  selectedParticipant: any;
  selectedProjectId: number;
  createdById: number;
  solicitudId: number;

  @Output() assignProjectEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoincidenciaModalComponent>,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createdById = data.createdById;
    this.solicitudId = data.solicitudId;
  }

  ngOnInit(): void {
    this.participantId = Number(this.route.snapshot.paramMap.get('participantId'));
    this.obtenerProjectParticipants();
  }

  obtenerProjectParticipants(): void {
    this.http.get('http://127.0.0.1:8000/api/project-participant').subscribe(
      (response: any) => {
        this.projectParticipants = response.data.projectParticipants;
      }
    );
  }

  siButtonClick(projectId: number): void {
    this.selectedProjectId = projectId;
    this.assignProjectEvent.emit(projectId);
    const solicitudId = this.data.solicitudId;
    this.dialogRef.close();

    setTimeout(() => {
      this.router.navigate(['/system/solicitud/form', solicitudId], { queryParams: { projectId: projectId } });
    }, 2000);
  }

  

  noButtonClick(): void {
    const solicitudId = this.data.solicitudId;
    this.dialogRef.close();

    setTimeout(() => {
      this.router.navigate(['/system/solicitud/form', solicitudId])
    }, 2000);
  }

}
