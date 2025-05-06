import {Component, OnInit} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd, NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {ProfileService} from '../../services/profile.service';
import {AuthService} from '../../../auth/services/auth.service';
import {Profile} from '../../../../shared/models/Profile';
import {SharedModule} from '../../../../shared/shared.module';
import {LoaderService} from '../../../../core/services/loader.service';

@Component({
  selector: 'app-my-profile-layout',
  standalone: true,
  imports: [
    SharedModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './my-profile-layout.component.html',
  styleUrl: './my-profile-layout.component.scss'
})
export class MyProfileLayoutComponent implements OnInit {
  profile!: Profile;
  sidebarOpen: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchData();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loaderService.hide();
      }
    });
  }

  fetchData(): void {
    this.profileService.getMine().subscribe( res => {
      this.profile = res;
    })
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
