import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';
import { PortafoliosModels } from 'src/app/models/portafolio/portafolio.models';
import { FilesModels } from 'src/app/models/portafolio/files/file.models';
import { CustomFile } from 'src/app/models/portafolio/files/custom-file.interface';
import { DocumentoModels } from 'src/app/models/portafolio/documentos/documento.models';
import { ProyectoParticipanteModels } from 'src/app/models/proyecto/ProjectParticipant/proyecto-participante.moduls';

@Component({
  selector: 'app-portafolio-form',
  templateUrl: './portafolio-form.component.html',
  styleUrls: ['./portafolio-form.component.css']
})
export class PortafolioFormComponent {
  briefcaseForm: FormGroup;
  currentPortafolio: PortafoliosModels;
  selectedFiles: CustomFile[] = [];
  documentos: DocumentoModels;
  project: ProyectoParticipanteModels;
  
  constructor(
    private formBuilder: FormBuilder,
    private portafolioHttpService: PortafolioHttpService
  ) {
    this.initForm();
  }

  initForm() {
    this.briefcaseForm = this.formBuilder.group({
      observations: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(25),
            Validators.maxLength(100),
          ],
        },
      ],
      state: [
        '',
        {
          validators: [
            Validators.required,
          ],
        },
      ],
      files: [
        [],
        {
          validators: [Validators.required],
        },
      ],
    });

    this.briefcaseForm.valueChanges.subscribe((values) => {
      this.currentPortafolio = values;
      console.log('this.currentPortafolio:', this.currentPortafolio);
    });
  }

  onSubmit(): void {
    if (this.briefcaseForm.valid) {
      console.log('success valid');
      this.createBriefcase();
    } else {
      console.log('error');
    }
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const files: CustomFile[] = [];
  
      // Leer el contenido de los archivos seleccionados
      for (let i = 0; i < inputElement.files.length; i++) {
        const file = inputElement.files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const content = e.target.result; // Contenido del archivo en base64
          const customFile: CustomFile = {
            file: file,
            content: content,
            name: '',
            type: '',
            size: 0
          };
          files.push(customFile); // Agregar el objeto CustomFile al arreglo
        };
        reader.readAsDataURL(file);
      }
  
      this.selectedFiles = files; // Asignar el arreglo de CustomFile[] directamente
  
      console.log(this.selectedFiles);
    }
  }

  createBriefcase() {
    if (this.briefcaseForm.valid && this.selectedFiles.length > 0) {
      const briefcaseData: PortafoliosModels = {
        observations: this.currentPortafolio.observations,
        state: this.currentPortafolio.state,
        files: [],
        id: 0,
        project_participant_id: this.project,
        created_at: new Date(),
      };
  
      this.selectedFiles.forEach((file: CustomFile) => {
        const fileData: FilesModels = {
          id: 0, // Asigna un valor válido para 'id'
          name: file.name,
          type: file.type,
          content: file.content,
          size: file.size,
          observation: '',
          state: false,
          briefcase_id: 1, // Asigna un valor válido para 'briefcase_id'
          document_id: 1, // Asigna un valor válido para 'document_id'
        };
        briefcaseData.files.push(fileData);
      });
  
      this.portafolioHttpService.addPortafolios(briefcaseData).subscribe(
        (response) => {
          console.log('Portafolio creado exitosamente', response);
          // Realiza las acciones necesarias después de crear el portafolio
        },
        (error) => {
          console.error('Error al crear el portafolio', error);
          // Maneja el error de acuerdo a tus necesidades
        }
      );
    }
  }
}
