import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {NavigationStart, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationMenuComponent} from './shared/components/navigation-menu/navigation-menu.component';
import {CommonModule} from '@angular/common';
import {environment} from '../environments/environment';
import {HomeComponent} from './pages/home/components/home/home.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {NotificationService} from './shared/services/notification.service';
import { App as CapacitorApp } from '@capacitor/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, NavigationMenuComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'zoolandia-client';
  hideNavbar = false;
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;


  private hiddenRoutes: string[] = ['/profile/edit', '/post/multi-step-form', '/pet/create', '/access-denied', '/not-found', '/profile/preview'];
  private hiddenRoutePrefixes: string[] = ['/profile/my-profile-details', '/admin', '/auth/role-selection'];

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private notificationService: NotificationService,
    private location: Location
  ) {
    CapacitorApp.addListener('backButton', () => {
      if (this.router.url !== '/home') {
        this.location.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hideNavbar =
          this.hiddenRoutes.includes(event.url) ||
          this.hiddenRoutePrefixes.some(prefix => event.url.startsWith(prefix));
      }
    });
  }

  ngOnInit() {
    this.notificationService.initPushNotifications();
    this.loadGoogleMaps();
  }

  private loadGoogleMaps() {
    const script = this.renderer.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places,geometry&language=bg&loading=async`;
    script.async = true;
    script.defer = true;
    this.renderer.appendChild(document.head, script);
  }

  scrollToSection(section: string) {
    if (this.homeComponent) {
      this.homeComponent.scrollToSection(section);
    }
  }
}
