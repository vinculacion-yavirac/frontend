import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AuthCookieStorage } from '../../../app/auth/auth-cookie-storage';
import { AuthLocalStorage } from '../../../app/auth/auth-local-storage';
import { AuthTokenDecoder } from '../../../app/auth/auth-token-decoder';
import { AuthValidator } from '../../../app/auth/auth-validator';
import { UserAuth } from '../../../app/models/auth/user.interface';
import { environment } from '../../../environments/environment';

const API_URL = environment.API_URL + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private authLocalStorage: AuthLocalStorage,
    private authCookieStorage: AuthCookieStorage,
    private authValidator: AuthValidator,
    private authTokenDecoder: AuthTokenDecoder
  ) {}

  isAuthenticated(): boolean {
    return this.authValidator.isTokenValid(
      this.authCookieStorage.getRefreshToken()
    );
  }

  isAuthorized(permissions: string[]): boolean {
    const token = this.authCookieStorage.getRefreshToken();
    return this.authValidator.hasPermission(token, permissions);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/login`, { email, password }, this.httpOptions)
      .pipe(
        map((response) => {
          this.authLocalStorage.setAccessToken(response.data.accessToken);
          this.authCookieStorage.setRefreshToken(response.data.refreshToken);
          return response;
        }),
        catchError(this.handleError<any>('login'))
      );
  }

  logout(): Observable<any> {
    return this.http.delete<any>(`${API_URL}/logout`, this.httpOptions).pipe(
      tap(() => {
        this.authLocalStorage.removeAccessToken();
        this.authCookieStorage.removeRefreshToken();
      })
    );
  }

  getProfile(): Observable<UserAuth> {
    return this.http.get<UserAuth>(`${API_URL}/profile`, this.httpOptions);
  }

  updateProfile(user: UserAuth): Observable<UserAuth> {
    return this.http
      .put<UserAuth>(`${API_URL}/profile`, user, this.httpOptions)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError<any>('updateProfile'))
      );
  }

  getUser(): Observable<any> {
    const token = this.authCookieStorage.getRefreshToken();
    if (!this.authValidator.isTokenValid(token)) {
      return of(null);
    }
    const user = this.authTokenDecoder.decodeToken(token).user;
    return of(user);
  }

  refreshAccessToken(token: string): Observable<any> {
    if (!this.authValidator.isTokenValid(token)) {
      return of(null);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'refresh-token': token,
      }),
    };
    return this.http.post<any>(`${API_URL}/refresh`, {}, httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
