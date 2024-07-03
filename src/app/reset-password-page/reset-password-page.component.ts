import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidatorFunc } from '../registration-page/registration-page.component';
import { NgIf } from '@angular/common';
import { UserService } from '../user.service';
import { ActivatedRoute, Route, RouterLink } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.css'
})
export class ResetPasswordPageComponent {
  updatePasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [passwordMatchValidatorFunc(''), Validators.required]),
  })

  sendResetPasswordEmailForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  })

  resetToken: null | string = ""
  emailSent = false
  resetPassword = false

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  get confirmPassword(): AbstractControl | null {
    return this.updatePasswordForm.get('confirmPassword')
  }
  get password(): AbstractControl | null {
    return this.updatePasswordForm.get('password')
  }
  get email(): AbstractControl | null {
    return this.sendResetPasswordEmailForm.get('email')
  }

  ngOnInit() {
    this.resetToken = this.route.snapshot.queryParamMap.get('resetToken');
  }

  sendResetPasswordEmail() {
    if (this.sendResetPasswordEmailForm.valid) {
      this.userService.sendResetPasswordEmail(this.email!.value).pipe(catchError(() => {
        console.log("Send Reset Password Email Failed")
        return EMPTY
      })).subscribe(() => this.emailSent = true)
    }
  }

  updatePassword() {
    if (this.updatePasswordForm.valid && this.resetToken) {
      this.userService.resetPassword(this.resetToken, this.password!.value).pipe(catchError(() => {
        console.log("Reset Password Failed")
        return EMPTY
      })).subscribe(() => this.resetPassword = true)

    }
  }
}
