import {Component, ElementRef} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'services',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  constructor(
    public elementRef: ElementRef
  ) {}
}
