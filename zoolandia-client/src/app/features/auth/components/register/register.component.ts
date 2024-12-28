import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Route, Router} from '@angular/router';

import {AuthService} from '../../services/auth.service';
import {SharedModule} from '../../../../shared/shared.module';
import {passwordMatchValidator} from '../../../../core/validators/password-match.validator';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  role!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
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
    }, { validators: passwordMatchValidator })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'];
      if (this.role) {
        this.registerForm.patchValue({  role: Number(this.role) });
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
      this.toastr.success("Успешно се регистрира!");
      if (this.role == '2') {
        this.router.navigate(['/features/auth/multi-step-form'])
      } else {
        this.router.navigate(['/features/profile/edit']);
      }
    });
  }
}
