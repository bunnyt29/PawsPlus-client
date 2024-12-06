import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../../auth/services/auth.service';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {SharedModule} from '../../../../shared/shared.module';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    SharedModule,
    ImageUploadComponent
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  profileForm!: FormGroup;
  profile!: Profile;


  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
  ) { }


  ngOnInit(): void {

    if (!this.authService.isAuthenticated()) {
      // Redirect to login if the user is not authenticated
      this.router.navigate(['/login']);
    }
    this.fetchProfile();
  }

  fetchProfile(){
    this.profileService.getProfile().subscribe(res => {
      this.profile = res;
      this.profileForm = this.fb.group({
        'id': [this.profile.id],
        'firstName': [[this.profile.firstName], [Validators.required, Validators.minLength(2)]],
        'lastName': [[this.profile.lastName], [Validators.required, Validators.minLength(2)]],
        'photoUrl': [this.profile.photoUrl]
      })
    })
  }


  onFileUpload(file: File): void {
    console.log('File uploaded:', file);
  }

  
  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }
}
