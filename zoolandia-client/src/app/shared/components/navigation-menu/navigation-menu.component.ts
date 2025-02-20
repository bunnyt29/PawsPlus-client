import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('profileOptions') profileOptionsRef!: ElementRef;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  toggleOptions(): void {
    if (this.optionsVisible) {
      setTimeout(() => {
        this.optionsVisible = false;
        this.cd.detectChanges();
      }, 200);
    } else {
      this.optionsVisible = true;
      this.cd.detectChanges();
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (
      this.optionsVisible &&
      !this.eRef.nativeElement.contains(target)
    ) {
      this.optionsVisible = false;
      this.cd.detectChanges();
    }
  }

  checkAuthentication() : void {
    this.isLogged = this.authService.isAuthenticated();
    console.log(this.isLogged)
    if (this.isLogged) {
      this.profileService.getMine().subscribe(res => {
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
