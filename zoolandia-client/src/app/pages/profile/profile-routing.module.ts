import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MyProfileLayoutComponent} from './components/my-profile-layout/my-profile-layout.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {MyPostComponent} from '../post/components/my-post/my-post.component';
import {ProfileResolver} from './services/profile-resolver.guard';
import {MyPetsComponent} from '../pet/components/my-pets/my-pets.component';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/edit/edit.component').then((m) => m.EditComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'details',
    loadComponent: () =>
      import('./components/details/details.component').then((m) => m.DetailsComponent)
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./components/sitter-details-preview/sitter-details-preview.component').then((m) => m.SitterDetailsPreviewComponent),
    data: { allowedRoles: ['Administrator'] }
  },
  {
    path: 'my-profile-details',
    component: MyProfileLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'my-profile',
        pathMatch: 'full'
      },
      {
        path: 'my-profile',
        component: MyProfileComponent,
        resolve: { profile: ProfileResolver }
      },
      {
        path: 'my-pets',
        component: MyPetsComponent,
        resolve: { profile: ProfileResolver }
      },
      {
        path: 'my-post',
        component: MyPostComponent,
        resolve: { profile: ProfileResolver }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        resolve: { profile: ProfileResolver }
      }
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
