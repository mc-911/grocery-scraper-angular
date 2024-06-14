import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../user.service';
import { EMPTY, catchError, first } from 'rxjs';
const passwordMatchValidatorFunc = (password: string): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  console.log("Checking Password")
  const password = control.parent?.get('password') ? control.parent?.get('password')!.value : ''
  const forbidden = control.value != password
  return forbidden ? { passwordsDontMatch: { value: control.value } } : null;
}
const emailInUseValidatorFunc = (emailInUseMsg: boolean): ValidatorFn => (control: AbstractControl): ValidationErrors | null => {
  return emailInUseMsg ? { emailInUse: { value: control.value } } : null;
}
@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule, NgIf],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css'
})
export class RegistrationPageComponent {
  emailInUse = false;
  serverError = '';
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    firstName: new FormControl('', [Validators.maxLength(100), Validators.required]),
    lastName: new FormControl('', [Validators.maxLength(100), Validators.required]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', [passwordMatchValidatorFunc(''), Validators.required]),
  })
  @ViewChild('plus') plus!: ElementRef<SVGElement>;
  registrationFormSubmitted = false;
  emailSent = false;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.registrationForm.get('email')?.statusChanges.subscribe(() => {
      console.log("Status Changed");
      const emailInput = this.registrationForm.get('email')
      if (emailInput && emailInput.value) {
        emailInput?.setValue(emailInput.value?.trim(), { emitEvent: false })
      }
    })
  }
  /**
   * register
   */
  public register() {
    console.log(this.email?.touched)
    this.registrationFormSubmitted = true;
    this.userService.registerUser(this.email?.value.trim(), this.firstName?.value.trim(), this.lastName?.value.trim(), this.password?.value.trim()).pipe(catchError((err) => {
      console.log(err.cause)
      if (err.cause === "email") {
        this.emailInUse = true
        this.email?.setValidators([Validators.email, Validators.required, emailInUseValidatorFunc(this.emailInUse)])
        this.email?.updateValueAndValidity()
        this.email?.valueChanges.pipe(first()).subscribe(() => {
          this.emailInUse = false;
          this.email?.setValidators([Validators.email, Validators.required])
          this.email?.updateValueAndValidity()
        })
      } else {
        this.serverError = err.message
      }
      return EMPTY
    })).subscribe((resp) => {
      console.log("Email Sent")
      this.emailSent = true;
    })
  }

  get confirmPassword(): AbstractControl | null {
    return this.registrationForm.get('confirmPassword')
  }
  get password(): AbstractControl | null {
    return this.registrationForm.get('password')
  }
  get email(): AbstractControl | null {
    return this.registrationForm.get('email')
  }
  get firstName(): AbstractControl | null {
    return this.registrationForm.get('firstName')
  }
  get lastName(): AbstractControl | null {
    return this.registrationForm.get('lastName')
  }

  /**
   * Spin Plus
   */
  public spinPlus() {
    // this.plus.nativeElement.classList.toggle("spin")
    // this.plus.nativeElement.offsetWidth;
    // // setTimeout(() => null, 100)
    // this.plus.nativeElement.classList.add("spin")
    console.log("Spin")
    this.plus.nativeElement.style.animationPlayState = "running"
  }

}
