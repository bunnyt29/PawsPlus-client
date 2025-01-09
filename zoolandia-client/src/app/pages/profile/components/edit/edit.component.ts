import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {AuthService} from '../../../auth/services/auth.service';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {SharedModule} from '../../../../shared/shared.module';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {FileService} from '../../../../core/services/file.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    SharedModule,
    ImageUploadComponent,
    RouterLink
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit {
  profileForm!: FormGroup;
  profile!: Profile;
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private fileService: FileService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      'id': [''],
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required, Validators.minLength(2)]],
      'description': [''],
      'phoneNumber': ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      'photoUrl': ['']
    });

    this.fetchProfile();
  }

  fetchProfile(){
    this.profileService.getProfile().subscribe(res => {
      this.profile = res;
      this.profileForm.patchValue({
        'id': this.profile.id,
        'firstName': this.profile.firstName,
        'lastName': this.profile.lastName,
        'description': this.profile.description,
        'phoneNumber': this.profile.phoneNumber,
        'photoUrl': this.profile.photoUrl
      });
      this.defaultImage = this.profile.photoUrl;
    })
  }

  onFileUpload(file: File): void {
    this.fileService.uploadImage(file).subscribe({
      next: (res) => {
        const photoUrl = res.imageUrl;
        this.profileForm.patchValue({ photoUrl: photoUrl });
      },
      error: (err) => {
        console.error('File upload failed:', err);
      },
    });
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  editProfile(){
    this.profileService.editProfile(this.profile.id, this.profileForm.value).subscribe( () => {
      this.toastr.success("Успешно редактира профила си!");
      this.router.navigate(['/profile/my-profile-details'])
    });
  }
}
