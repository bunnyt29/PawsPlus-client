import {Routes} from '@angular/router';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "home",
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomeModule)
  },
  {
    path: "auth",
    loadChildren: () => import("./pages/auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: "admin",
    loadChildren: () => import("./pages/admin/admin.module").then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: { allowedRoles: ['Administrator'] }
  },
  {
    path: "profile",
    loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfileModule)
  },
  {
    path: "pet",
    loadChildren: () => import("./pages/pet/pet.module").then((m) => m.PetModule),
    canActivate: [AuthGuard],
  },
  {
    path: "post",
    loadChildren: () => import("./pages/post/post.module").then((m) => m.PostModule),
    canActivate: [AuthGuard],
    data: {allowedRoles: ['Sitter']}
  },
  {
    path: "search",
    loadChildren: () => import("./pages/search/search.module").then((m) => m.SearchModule)
  },
  {
    path: 'access-denied',
    loadComponent: () =>
      import('./shared/components/access-denied/access-denied.component').then((m) => m.AccessDeniedComponent)
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent)
  }
];
