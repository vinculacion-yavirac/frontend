import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FilesModels } from 'src/app/models/portafolio/files/file.models';

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



  uploadFiles(files: File[], idPortafolio: number, idDocumento: number): void {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('files[]', file, file.name);
    });
  
    this.http.post(`${this.url}/upload/${idPortafolio}/${idDocumento}`, formData).subscribe(
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
