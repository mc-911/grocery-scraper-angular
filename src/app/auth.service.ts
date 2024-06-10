import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  set authToken(authToken: string) {
    localStorage.setItem('authToken', authToken);
  }

  get authToken() {
    const token = localStorage.getItem("authToken")
    return token ? token : ''
  }

  checkAuth() {
    if (!this.authToken) {
      this.router.navigate(["/", "login"])
    }
  }
}
