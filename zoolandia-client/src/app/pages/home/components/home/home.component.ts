import { Component } from '@angular/core';
import {FastSearchComponent} from '../fast-search/fast-search.component';
import {ServicesComponent} from '../services/services.component';
import {BecomeSitterComponent} from '../become-sitter/become-sitter.component';
import {WhyChooseUsComponent} from '../why-choose-us/why-choose-us.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FastSearchComponent,
    ServicesComponent,
    BecomeSitterComponent,
    WhyChooseUsComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
