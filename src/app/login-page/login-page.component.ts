import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, NgIf],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  loginForm = new FormGroup({ email: new FormControl('', [Validators.required]), password: new FormControl('', Validators.required) })
  errorMessage = '';
  @ViewChild('plus') plus!: ElementRef<SVGElement>;
  constructor(private userService: UserService) { }

  /**
   * Login
   */
  public Login() {
    if (this.loginForm.valid) {
      const email = this.email?.value;
      const password = this.password?.value;
      if (email && password) {
        this.userService.loginUser(email, password).pipe(catchError(err => {
          this.errorMessage = err.message
          return EMPTY
        })).subscribe(resp => {
        })
      }
    }
  }

  get email() {
    return this.loginForm.get("email")
  }

  get password() {
    return this.loginForm.get("password")
  }
  /**
 * Spin Plus
 */
  public spinPlus() {
    console.log("Spin")
    this.plus.nativeElement.classList.remove("spin")
    this.plus.nativeElement.classList.add("spin")
  }
}
