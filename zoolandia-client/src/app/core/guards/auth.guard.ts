import {ActivatedRouteSnapshot, CanActivateFn, UrlTree, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, catchError, map, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '../../pages/auth/services/auth.service';
import {ProfileService} from '../../pages/profile/services/profile.service';

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

  const allowedRoles: string[] = route.data?.['allowedRoles'] || [];

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
