import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../pages/auth/services/auth.service';
import {ProfileService} from '../../../pages/profile/services/profile.service';
import {Profile} from '../../models/Profile';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'navigation-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './navigation-menu.component.html',
  styleUrl: './navigation-menu.component.scss'
})
export class NavigationMenuComponent implements OnInit{
  profile!: Profile;
  isLogged: boolean = false;
  optionsVisible: boolean = false;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  toggleOptions(): void {
    this.optionsVisible = !this.optionsVisible;
    this.cd.detectChanges();
  }

  checkAuthentication() : void {
    this.isLogged = this.authService.isAuthenticated();
    if (this.isLogged) {
      this.profileService.getProfile().subscribe(res => {
        this.profile = res;
        this.cd.detectChanges();
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLogged = this.authService.isAuthenticated();
    this.router.navigate(['/home']);
  }
}
