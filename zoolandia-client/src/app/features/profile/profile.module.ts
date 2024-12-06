import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import {ImageUploadComponent} from '../../shared/components/image-upload/image-upload.component';
import {provideHttpClient} from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class ProfileModule { }
