import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CustomFile } from 'src/app/models/portafolio/files/custom-file.interface';

@Injectable({
  providedIn: 'root'
})
export class FileHttpService {

  constructor(private http: HttpClient) { }

  private url = environment.API_URL + '/files';

  getFiles() {
    return this.http.get(`${this.url}`);
  }

  uploadFiles(files: CustomFile[], idBriefcase: number): void {
    const formData = new FormData();

    files.forEach((file: CustomFile) => {
      formData.append('files[]', file.file);
      formData.append('names[]', file.file.name);
      formData.append('types[]', file.file.type);
      formData.append('document_ids[]', file.document_id.toString());
      formData.append('observations[]', file.observation);
      formData.append('states[]', file.state.toString());
    });

    this.http.post(`${this.url}/upload/${idBriefcase}`, formData).subscribe(
      (response: any) => {
        console.log('Archivos enviados correctamente');
      },
      (error: any) => {
        console.error('Error al enviar los archivos:', error);
      }
    );
  }


  downloadFile(idPortafolio: number,idDocumento:number,idFile:number ) {
    return this.http.get(`${this.url}/download/${idPortafolio}/${idDocumento}/${idFile}`, { responseType: 'blob' });
  }


}
