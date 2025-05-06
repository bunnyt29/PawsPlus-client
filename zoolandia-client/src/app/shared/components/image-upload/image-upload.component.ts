import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgIf} from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnChanges {
  @Input() isInvalid: boolean = false;
  @Input() width: string = '169px';
  @Input() height: string = '169px';
  @Input() defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  @Output() fileSelected = new EventEmitter<File>();

  previewImage: string | ArrayBuffer | null | undefined = this.defaultImage;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultImage'] && changes['defaultImage'].currentValue) {
      this.previewImage = changes['defaultImage'].currentValue;
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    const files = input?.files;
    if (files && files.length > 0) {
      const file: File = files[0];
      this.fileSelected.emit(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected or files property is null/undefined.');
    }
  }

}
