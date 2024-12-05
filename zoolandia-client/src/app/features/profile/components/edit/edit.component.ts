import {Component, OnInit} from '@angular/core';
import {ImageUploadComponent} from "../../../../shared/components/image-upload/image-upload.component";
import {Profile} from "../../../../shared/models/Profile";
import {ProfileService} from "../../services/profile.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SharedModule} from "../../../../shared/shared.module";

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [SharedModule, ImageUploadComponent],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit{
  profileForm!: FormGroup;
  profile!: Profile;
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
    // Add logic to handle the file
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

}
