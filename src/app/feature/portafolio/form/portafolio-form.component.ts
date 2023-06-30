import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PortafolioHttpService } from '../../../../app/service/portafolio/portafolio-http.service';

@Component({
  selector: 'app-portafolio-form',
  templateUrl: './portafolio-form.component.html',
  styleUrls: ['./portafolio-form.component.css']
})
export class PortafolioFormComponent {
  briefcaseForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private portafolioHttpService: PortafolioHttpService
  ) {
    this.briefcaseForm = this.formBuilder.group({
      observations: '',
      state: false,
      files: null // Initialize files as null or empty array based on your requirement
    });
  }

  onSubmit() {
    const formData = new FormData();
    const briefcaseData = this.briefcaseForm.value;

    for (const key in briefcaseData) {
      if (key === 'files') {
        const fileList: FileList = briefcaseData[key];
        for (let i = 0; i < fileList.length; i++) {
          const file: File = fileList[i];
          const reader = new FileReader();
      
          reader.onload = (event: any) => {
            const fileContent = event.target.result;
            const blob = new Blob([fileContent]);
      
            formData.append('files[]', blob, file.name);
          };
      
          reader.readAsArrayBuffer(file);
        }
      } else {
        formData.append(key, briefcaseData[key]);
      }
      
    }

    this.portafolioHttpService.addPortafolios(formData).subscribe(
      (response) => {
        console.log('Portafolio creado exitosamente', response);
        // Realiza las acciones adicionales que necesites después de crear el portafolio
      },
      (error) => {
        console.error('Error al crear el portafolio', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }
}
