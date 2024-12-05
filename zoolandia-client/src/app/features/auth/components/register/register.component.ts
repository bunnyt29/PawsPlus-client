import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import { confirmPasswordValidator } from '../../../../confirm-password.validator';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {SharedModule} from "../../../../shared/shared.module";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [SharedModule, NgOptimizedImage]
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  )
  {
    this.registerForm = this.fb.group({
      'firstName': ['', [Validators.required]],
      'lastName': ['', [Validators.required]],
      'email': ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      'phoneNumber': ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      'password': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]],
      'role': [null, [Validators.required]]
    }, { validators: confirmPasswordValidator })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      if (role) {
        this.registerForm.patchValue({  role: Number(role) });
      }
    });
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
    const formData = { ...this.registerForm.value };
    delete formData.confirmPassword;

    this.authService.register(formData).subscribe(data => {
      console.log("send to the server");
    });
  }
}
