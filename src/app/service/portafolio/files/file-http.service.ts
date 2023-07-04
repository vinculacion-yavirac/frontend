import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileHttpService {

  constructor(private http: HttpClient) { }

  private url = environment.API_URL + '/files';

  getFiles() {
    return this.http.get(`${this.url}`);
  }


  uploadFile(formData: FormData) {
    return this.http.post(`${this.url}/upload`, formData);
  }

  downloadFile(id: number) {
    return this.http.get(`${this.url}/download/${id}`, { responseType: 'blob' });
  }
}
