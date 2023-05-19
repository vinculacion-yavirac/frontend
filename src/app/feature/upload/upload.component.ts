import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileHttpService } from '../../../app/service/portafolio/files/file-http.service';
import { FilesModels } from '../../../app/models/portafolio/files/file.models';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {

  files: FilesModels[];

  constructor(
    private http: HttpClient,
    private fileHttpService: FileHttpService
  ) { }

  ngOnInit(): void {
    this.getFiles()
  }

  public archivoSeleccionado: File;

  getFiles() {
    this.fileHttpService.getFiles().subscribe((response:any) => {
      this.files = response.data.files;
    });
  }

  onArchivoSeleccionado(event: any) {
    this.archivoSeleccionado = event.target.files[0];
    this.enviarArchivo();
  }

  enviarArchivo() {
    const formData = new FormData();
    formData.append(
      'archivo',
      this.archivoSeleccionado,
      this.archivoSeleccionado.name
    );
    this.fileHttpService.uploadFile(formData).subscribe((response) => {
      console.log(response);
    });
  }

   downloadFile(id: number, name: string) {
    this.fileHttpService.downloadFile(id).subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
  }
}
