import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import { confirmPasswordValidator } from '../confirm-password.validator';
import {AuthService} from "../services/auth.service";


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  )
  { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      'phoneNumber': ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]]
    }, { validators: confirmPasswordValidator })
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get passwordMatchError() {
    return this.registerForm.errors?.['PasswordNoMatch'] && this.registerForm.get('confirmPassword')?.touched;
  }
  register() {
    this.authService.register(this.registerForm.value).subscribe(data => {
      console.log("send to the server");
    });
  }
}
