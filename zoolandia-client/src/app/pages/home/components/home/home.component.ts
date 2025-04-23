import {Component, ElementRef, ViewChild} from '@angular/core';
import {FastSearchComponent} from '../fast-search/fast-search.component';
import {ServicesComponent} from '../services/services.component';
import {BecomeSitterComponent} from '../become-sitter/become-sitter.component';
import {WhyChooseUsComponent} from '../why-choose-us/why-choose-us.component';
import {FooterComponent} from '../footer/footer.component';
import {Capacitor} from '@capacitor/core';
import {FirebaseMessaging, GetTokenOptions} from '@capacitor-firebase/messaging';

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
  @ViewChild(ServicesComponent) services!: ServicesComponent;
  @ViewChild(BecomeSitterComponent) becomeSitter!: BecomeSitterComponent;
  @ViewChild(WhyChooseUsComponent) whyChooseUs!: WhyChooseUsComponent;
  public token = "";

  constructor() {
    FirebaseMessaging.addListener("notificationReceived", (event) => {
      console.log("notificationReceived: ", { event });
    });
    FirebaseMessaging.addListener("notificationActionPerformed", (event) => {
      console.log("notificationActionPerformed: ", { event });
    });
  }

  scrollToSection(section: string) {
    let element: HTMLElement;

    switch (section) {
      case 'services':
        element = this.services?.elementRef.nativeElement;
        break;
      case 'become-sitter':
        element = this.becomeSitter?.elementRef.nativeElement;
        break;
      case 'why-choose-us':
        element = this.whyChooseUs?.elementRef.nativeElement;
        break;
      default:
        return;
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public async requestPermissions(): Promise<void> {
    await FirebaseMessaging.requestPermissions();
  }
}
