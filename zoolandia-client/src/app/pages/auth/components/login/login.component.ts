import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../../services/auth.service';
import {SharedModule} from '../../../../shared/shared.module';
import {ToastrService} from 'ngx-toastr';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Route, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  )
  { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]]
    })
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    this.authService.login(this.loginForm.value).subscribe(res => {
      this.authService.saveToken(res['token']);
      if(res.roles == "Administrator") {
        this.router.navigate(['/admin/dashboard'])
      } else {
        if (res.firstLogin) {
          if (res.roles == "Sitter") {
            this.router.navigate(['/post/multi-step-form']);
          } else {
            this.router.navigate(['/profile/edit']);
          }
        } else {
          this.router.navigate(['/profile/my-profile-details']);
        }
      }
    })
  }
}
