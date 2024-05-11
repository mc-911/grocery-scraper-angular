import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  set authToken(authToken: string) {
    localStorage.setItem('authToken', authToken);
  }

  get authToken() {
    const token = localStorage.getItem("authToken")
    return token ? token : ''
  }
}
