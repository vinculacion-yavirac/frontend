import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EncryptionService } from './encryption.service';

const COOKIE_STORAGE_TOKEN_REFRESH_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthCookieStorage {
  constructor(
    private cookieService: CookieService,
    private encryptionService: EncryptionService
  ) {}

  setRefreshToken(token: string): void {
    const encryptedToken = this.encryptionService.encrypt(token);
    this.cookieService.set(
      COOKIE_STORAGE_TOKEN_REFRESH_KEY,
      encryptedToken,
      1,
      '/'
    );
  }

  getRefreshToken(): string {
    const encryptedToken = this.cookieService.get(
      COOKIE_STORAGE_TOKEN_REFRESH_KEY
    );
    if (!encryptedToken) {
      return '';
    }
    return this.encryptionService.decrypt(encryptedToken);
  }

  removeRefreshToken(): void {
    this.cookieService.delete(COOKIE_STORAGE_TOKEN_REFRESH_KEY, '/');
  }
}
