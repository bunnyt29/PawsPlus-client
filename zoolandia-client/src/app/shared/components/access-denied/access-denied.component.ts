import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
  constructor(private location: Location)
  {}

  goBack() {
    this.location.back();
  }
}
