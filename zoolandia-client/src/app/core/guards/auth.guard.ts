import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Router } from '@angular/router';
import {AuthService} from '../../pages/auth/services/auth.service';
import {ProfileService} from '../../pages/profile/services/profile.service';
import {catchError, map, Observable, of} from 'rxjs';


export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return of(router.createUrlTree(['/auth/login']));
  }

  return profileService.getMine().pipe(
    map((profile: any): boolean | UrlTree => {
      const userRole: string = profile.roles;
      console.log(profile.roles)
      const allowedRoles: string[] = route.data['allowedRoles'] || [];

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return router.createUrlTree(['/access-denied']);
      }

      return true;
    }),
    catchError(() => of(router.createUrlTree(['/auth/login'])))
  );
};
