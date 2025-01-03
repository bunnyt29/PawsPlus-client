import {Component} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-constants',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.scss'
})

export class MultiStepFormComponent {

}
