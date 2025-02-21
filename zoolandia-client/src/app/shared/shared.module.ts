import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ProfileModule} from '../pages/profile/profile.module';
import {TranslateServicePipe} from './pipes/translate-service.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, ProfileModule],
  exports: [CommonModule, ReactiveFormsModule]
})
export class SharedModule { }
