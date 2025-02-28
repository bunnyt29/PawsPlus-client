import {Component, OnInit} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {AuthService} from '../../../auth/services/auth.service';
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
export class MyProfileLayoutComponent implements OnInit{
  profile!: Profile;
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchData();
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
