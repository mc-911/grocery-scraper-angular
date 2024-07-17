import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

interface LoginResponse {
  token: string
  isNewUser: boolean
  id: string
}
interface RegistrationResponse {

}
interface GetUserResponse {
  "first name": string,
  "last name": string
}
enum LoginErrorCode {
  NOT_VERIFIED = 0,
  INVALID_EMAIL_OR_PASSWORD = 1
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

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

  set userId(id: string) {
    localStorage.setItem('userId', id);
  }

  get userId() {
    const storedUserId = localStorage.getItem('userId')
    return storedUserId ? storedUserId : ''
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

  public logOut() {
    this.authService.authToken = "";
    this.router.navigate(["/", "login"])
  }

  handleDeleteUserError(error: HttpErrorResponse) {
    if (error.status == 401) {
      return throwError(() => new Error('Unauthorized'))
    } else {
      return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }

  deleteUser(id: string) {
    const url = environment.apiUrl + '/user/' + id
    return this.http.delete<any>(url).pipe(catchError(this.handleDeleteUserError))
  }

  resetPassword(token: string, newPassword: string) {
    const url = environment.apiUrl + '/resetPassword'
    const headers = new HttpHeaders({
      "Authorization": token
    });
    return this.http.patch<any>(url, { newPassword }, { headers }).pipe(catchError(this.handleDeleteUserError))
  }

  sendResetPasswordEmail(email: string) {
    const url = environment.apiUrl + '/resetPasswordEmail'
    return this.http.post<any>(url, { email }).pipe(catchError(this.handleDeleteUserError))
  }

  getUserInfo(id: string) {
    const url = environment.apiUrl + '/user'
    return this.http.get<GetUserResponse>(url + "/" + id).pipe(catchError(this.handleDeleteUserError))
  }

}
