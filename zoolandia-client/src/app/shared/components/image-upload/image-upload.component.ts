import {Component, Input, Output} from '@angular/core';
import EventEmitter from 'node:events';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  // @Input() defaultImage: string = '../../../../assets/images/shared/default-image-owner.svg';
  // @Output() fileSelected = new EventEmitter<File>();
  //
  // previewImage: string | ArrayBuffer | null = this.defaultImage;
  //
  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //
  //   if (input.files && input.files.length) {
  //     const file: File = input.files![0];
  //     this.fileSelected.emit(file);
  //
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.previewImage = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     console.error('No file selected or files property is null.');
  //   }
  // }
}
