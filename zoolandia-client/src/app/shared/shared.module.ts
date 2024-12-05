import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";
import { ImageUploadComponent } from './components/image-upload/image-upload.component';



@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [CommonModule, ReactiveFormsModule]
})
export class SharedModule { }
