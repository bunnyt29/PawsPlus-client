import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {NgIf} from '@angular/common';
import {Profile} from '../../../../shared/models/Profile';
import {ProfileService} from '../../services/profile.service';
import {SharedModule} from '../../../../shared/shared.module';

@Component({
  selector: 'app-basic-profile',
  standalone: true,
  imports: [
    FormsModule,
    ImageUploadComponent,
    NgIf,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './basic-profile.component.html',
  styleUrl: './basic-profile.component.scss'
})
export class BasicProfileComponent implements OnInit{
  profile!: Profile
  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(){
    this.profileService.getProfile().subscribe(res => {
      this.profile = res;
      console.log(this.profile);
    })
  }
}
