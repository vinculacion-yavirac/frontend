import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FilesModels } from 'src/app/models/portafolio/files/file.models';
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


  // uploadFiles(files: File[],idPortafolio: number,idDocumento:number): void {
  //   const formData = new FormData();
  //   files.forEach((file: File) => {
  //     formData.append('files[]', file, file.name);
  //  });
  //   this.http.post(`${this.url}/download/${idPortafolio}/${idDocumento}`,files)
  //   // this.http
  //   //   .post(`${environment.API_URL}/files/upload/${idPortafolio}/${idDocumento}`, formData)
  //   //   .subscribe();
  // }



  // uploadFiles(files: CustomFile[], idBriefcase:number): void {
  //   const formData = new FormData();
  //   files.forEach((file: CustomFile) => {
  //     formData.append('files[]', file.file, file.file.name);
  //     formData.append('document_id', file.document_id.toString());
  //   });
  
  //   this.http.post(`${this.url}/upload/${idBriefcase}`, formData).subscribe(
  //     (response: any) => {
  //       console.log('Archivos enviados correctamente');
  //     },
  //     (error: any) => {
  //       console.log('Error al enviar los archivos:', error);
  //     }
  //   );
  // }
  

  // uploadFiles(files: CustomFile[], idBriefcase: number): void {
  //   const formData = new FormData();
    
  //   files.forEach((file: CustomFile) => {
  //     const combinedValue = `${file.file.name};${file.document_id}`;
  //     formData.append('files[]', file.file, combinedValue);
  //   });
  
  //   this.http.post(`${this.url}/upload/${idBriefcase}`, formData).subscribe(
  //     (response: any) => {
  //       console.log('Archivos enviados correctamente');
  //     },
  //     (error: any) => {
  //       console.log('Error al enviar los archivos:', error);
  //     }
  //   );
  // }


  uploadFiles(files: CustomFile[], idBriefcase: number): void {
    const formData = new FormData();
    
    files.forEach((file: CustomFile) => {
      formData.append('files[]', file.file);
      formData.append('names[]', file.file.name);
      formData.append('types[]', file.file.type);
      formData.append('document_ids[]', file.document_id.toString());
    });
  
    this.http.post(`${this.url}/upload/${idBriefcase}`, formData).subscribe(
      (response: any) => {
        console.log('Archivos enviados correctamente');
      },
      (error: any) => {
        console.log('Error al enviar los archivos:', error);
      }
    );
  }
  
  

  





  downloadFile(id: number) {
    return this.http.get(`${this.url}/download/${id}`, { responseType: 'blob' });
  }
}
