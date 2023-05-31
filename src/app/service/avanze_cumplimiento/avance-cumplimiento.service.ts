import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvanceCumplimientoService {

  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  private url = environment.API_URL + '/avanze';


  public addAvanze(data: any): Observable<any> {
    console.log(data);

    return this.http.post<any>(
      `${this.url}/create`, data,
      this.httpOptions
    );
  }
  public getAvanze(): Observable<any> {

    return this.http.get<any>(
      `${this.url}/`,
      this.httpOptions
    );
  }
  public getAvanzeById(id:any): Observable<any> {

    return this.http.get<any>(
      `${this.url}/${id}`,
      this.httpOptions
    );
  }
  
  public updateAvanze(id: any, data: any): Observable<any> {

    return this.http.put(
      `${this.url}/update/${id}`, data, this.httpOptions
    );
  }


  public deleteAvanzeById(id: any): Observable<any> {

    return this.http.delete<any>(
      `${this.url}/delete/${id}`, this.httpOptions
    );

  }


}
