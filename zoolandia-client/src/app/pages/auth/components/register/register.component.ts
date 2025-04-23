import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { SharedModule } from '../../../../shared/shared.module';
import { passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    SharedModule,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  role!: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
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
        this.registerForm.patchValue({ role: Number(this.role) });
      }
    });

    // Push notification setup
    this.setupPushNotifications();
  }

  setupPushNotifications = async () => {
    try {
      // Check permissions and request if necessary
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      // Register for notifications
      await PushNotifications.register();

      // Add listeners for different events
      await this.addPushNotificationListeners();
    } catch (error) {
      console.error('Push notifications setup failed: ', error);
    }
  }

  addPushNotificationListeners = async () => {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
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
    this.authService.register(formData).subscribe(() => {
      this.toastr.warning("Изпратихме ти съобщение! Потвърди имейла си!");
    });
  }
}
