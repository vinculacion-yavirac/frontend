import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportadorService {

  private url = environment.API_URL + '/users';


  constructor(private http: HttpClient) { }

  importarUsuarios(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const data: ArrayBuffer = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

        // Supongamos que los datos de los usuarios están en la primera hoja del archivo Excel
        const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convierte los datos de la hoja del Excel a un arreglo de objetos
        const usuariosImportados: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Procesa los usuarios importados y realiza las operaciones necesarias para guardarlos en la base de datos
        // En este ejemplo, simplemente estamos imprimiendo los usuarios importados en la consola
        console.log('Usuarios importados:', usuariosImportados);

        // Simula una solicitud HTTP para guardar los usuarios en la base de datos
        this.guardarUsuariosEnBD(usuariosImportados)
          .then(() => {
            resolve(); // Resuelve la promesa si la operación de guardado es exitosa
          })
          .catch((error) => {
            reject(error); // Rechaza la promesa si ocurre un error en la operación de guardado
          });
      };

      reader.readAsArrayBuffer(file);
    });
  }

  guardarUsuariosEnBD(usuarios: any[]): Promise<void> {
    // Realiza la operación de guardar los usuarios en la base de datos utilizando un servicio o una API adecuada
    // Puedes hacer una solicitud HTTP POST para enviar los usuarios al servidor

    // Ejemplo de solicitud HTTP utilizando HttpClient
    return this.http.post<void>(`${this.url}/users`, usuarios).toPromise();
  }

}
