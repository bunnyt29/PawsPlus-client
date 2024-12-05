import { Component } from '@angular/core';
import {ImageUploadComponent} from "../../../../shared/components/image-upload/image-upload.component";

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ImageUploadComponent],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent {
  onFileUpload(file: File): void {
    console.log('File uploaded:', file);
    // Add logic to handle the file
  }
}
