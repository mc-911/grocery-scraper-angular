import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { EMPTY, catchError } from 'rxjs';
import { AuthService } from '../auth.service';

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
  emailToken = ''
  verifiedEmail = false
  @ViewChild('plus') plus!: ElementRef<SVGElement>;
  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    const verificationToken = this.route.snapshot.queryParamMap.get('verificationToken');
    console.log(verificationToken, 1)
    if (verificationToken) {
      this.userService.verifyUser(verificationToken).pipe(catchError(err => {
        this.errorMessage = err.message
        return EMPTY
      })).subscribe(resp => {
        this.verifiedEmail = true
      })
    }
  }

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
          if (resp.token) {
            this.authService.authToken = resp.token;
            if (resp.isNewUser) {
              this.userService.isNewUser = resp.isNewUser
            }
            this.router.navigate(["/", "home"])
          }
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
