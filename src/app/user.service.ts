import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';

interface LoginResponse {
  token?: string
  errors?: string[]
  isNewUser?: boolean
}
interface RegistrationResponse {

}
enum LoginErrorCode {
  NOT_VERIFIED = 0,
  INVALID_EMAIL_OR_PASSWORD = 1
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  loginEndpoint = "/login"
  registrationEndpoint = "/register"
  verifyEndpoint = "/verify"

  get isNewUser() {
    const newUser = localStorage.getItem('isNewUser')
    return newUser == "true"
  }

  set isNewUser(bool: boolean) {
    localStorage.setItem('isNewUser', bool ? "true" : "false");
  }

  loginUser(email: string, password: string) {
    console.log(environment.apiUrl + this.loginEndpoint)
    return this.http.post<LoginResponse>(environment.apiUrl + this.loginEndpoint, { email, password }).pipe(catchError(this.handleLoginError))
  }

  handleLoginError(error: HttpErrorResponse) {
    const errorCode = error.error["errorCode"]
    console.log(errorCode);
    switch (errorCode) {
      case LoginErrorCode.INVALID_EMAIL_OR_PASSWORD:
        return throwError(() => new Error('Your email or password is incorrect'))
      case LoginErrorCode.NOT_VERIFIED:
        return throwError(() => new Error('Email is not verified. Please Verify your email'))
      default:
        return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.'))
    }
  }

  registerUser(email: string, firstName: string, lastName: string, password: string) {
    return this.http.post<RegistrationResponse>(environment.apiUrl + this.registrationEndpoint, { email, password, firstName, lastName }).pipe(catchError(this.handleRegisterError))
  }

  handleRegisterError(error: HttpErrorResponse) {
    console.log(error.message)
    if (error.status == 400) {
      return throwError(() => new Error('Email Already in use', { cause: "email" }))
    } else {
      return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }

  handleVerifyUser(error: HttpErrorResponse) {
    console.log(error);

    if (error.status == 400 || error.status == 401) {
      return throwError(() => new Error('Verification Link has expired, please register again', { cause: "expired_link" }))
    } else {
      return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }
  verifyUser(token: string) {

    const headers = new HttpHeaders({
      "Authorization": token
    })
    return this.http.post(environment.apiUrl + this.verifyEndpoint, {}, { headers }).pipe(catchError(this.handleVerifyUser))
  }

}
