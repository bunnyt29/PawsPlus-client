import { Component } from '@angular/core';
import {ImageUploadComponent} from "../../../../shared/components/image-upload/image-upload.component";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-details',
  standalone: true,
    imports: [
        ImageUploadComponent,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

}
