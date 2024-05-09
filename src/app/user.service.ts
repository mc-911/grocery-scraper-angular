import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';

interface LoginResponse {
  token?: string
  errors?: string[]
}
interface RegistrationResponse {

}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  loginEndpoint = "/login"
  registrationEndpoint = "/register"

  loginUser(email: string, password: string) {
    console.log(environment.apiUrl + this.loginEndpoint)
    return this.http.post<LoginResponse>(environment.apiUrl + this.loginEndpoint, { email, password }).pipe(catchError(this.handleLoginError))
  }

  handleLoginError(error: HttpErrorResponse) {
    if (error.status == 401) {
      return throwError(() => new Error('Your email or password is incorrect'))
    } else {
      return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.'))
    }
  }

  registerUser(email: string, firstName: string, lastName: string, password: string) {
    return this.http.post<RegistrationResponse>(environment.apiUrl + this.registrationEndpoint, { email, password, firstName, lastName }).pipe(catchError(this.handleRegisterError))
  }

  handleRegisterError(error: HttpErrorResponse) {
    if (error.status == 400) {
      return throwError(() => new Error('Email Already in use', { cause: "email" }))
    } else {
      return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }

}
