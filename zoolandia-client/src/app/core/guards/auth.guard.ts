import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {catchError, map, Observable, of} from 'rxjs';
import {inject} from '@angular/core';

import {AuthService} from '../../pages/auth/services/auth.service';
import {ProfileService} from '../../pages/profile/services/profile.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);
  const allowedRoles: string[] = route.data?.['allowedRoles'] || [];

  if (!authService.isAuthenticated()) {
    return of(router.createUrlTree(['/auth/login']));
  }

  if (allowedRoles.length === 0) {
    return of(true);
  }

  return profileService.getMine().pipe(
    map((profile: any): boolean | UrlTree => {
      const userRoles: string[] = Array.isArray(profile.roles) ? profile.roles : [profile.roles];

      if (!userRoles.some(role => allowedRoles.includes(role))) {
        return router.createUrlTree(['/access-denied']);
      }

      return true;
    }),
    catchError(() => of(router.createUrlTree(['/auth/login'])))
  );
};
