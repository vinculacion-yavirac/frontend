import { Component, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/models/auth/user.interface';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';
import { AuthHttpService } from 'src/app/service/auth/auth-http.service';
import { ProyectoParticipanteHttpService } from 'src/app/service/proyecto/participante/proyecto-participante-http.service';

@Component({
  selector: 'app-asignado-estudiante',
  templateUrl: './asignado-estudiante.component.html',

})
export class AsignadoEstudianteComponent implements OnInit {

  user: UserAuth;
  proyectoParticipante: ProyectoParticipanteModels[];

  constructor(
    public authHttpService: AuthHttpService,
    private proyectoParticipanteService: ProyectoParticipanteHttpService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getProyectoParticipants();
    this.checkCurrentUserInParticipants();
  }

  getCurrentUser() {
    this.authHttpService.getUser().subscribe((user: UserAuth) => {
      this.user = user;
      console.log(this.user)


    });
  }

  getProyectoParticipants() {
    this.proyectoParticipanteService.getProyectoParticipants().subscribe(
      (proyectoParticipante: ProyectoParticipanteModels[]) => {
        this.proyectoParticipante = proyectoParticipante;
        console.log(this.proyectoParticipante);
      },
      (error) => {
        console.error('Error al obtener los datos del proyecto participante:', error);
      }
    );
  }



  checkCurrentUserInParticipants() {
    if (this.user && this.proyectoParticipante) {
      const currentUserEmail = this.user.email;
      console.log(currentUserEmail)
      const matchingParticipant = this.proyectoParticipante.find(participant => participant.participant_id.email === currentUserEmail);
      console.log(matchingParticipant)
      if (matchingParticipant) {
        console.log('El usuario actual está en la lista de participantes.');
        // Aquí puedes mostrar el mensaje o realizar otras acciones si hay una coincidencia.
      } else {
        console.log('El usuario actual NO está en la lista de participantes.');
      }
    }
  }









  getProyectoParticipantById(participantId: number) {
    this.proyectoParticipanteService.getByParticipantId(participantId).subscribe(
      (proyectoParticipante: ProyectoParticipanteModels[]) => {
        this.proyectoParticipante = proyectoParticipante;
        console.log(this.proyectoParticipante);
      },
      (error) => {
        console.error('Error al obtener los datos del proyecto participante:', error);
      }
    );
  }
}
