import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

const LOCAL_STORAGE_TOKEN_ACCESS_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthLocalStorage {
  constructor(private encryptionService: EncryptionService) {}

  setAccessToken(token: string): void {
    const encryptedToken = this.encryptionService.encrypt(token);
    localStorage.setItem(LOCAL_STORAGE_TOKEN_ACCESS_KEY, encryptedToken);
  }

  getAccessToken(): string {
    const encryptedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_ACCESS_KEY);
    if (!encryptedToken) {
      return '';
    }
    return this.encryptionService.decrypt(encryptedToken);
  }

  removeAccessToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_ACCESS_KEY);
  }
}
