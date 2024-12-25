import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/edit/edit.component').then((m) => m.EditComponent)
  },
  {
    path: 'details-mine',
    loadComponent: () =>
      import('./components/details-mine/details-mine.component').then((m) => m.DetailsMineComponent)
  },
  {
    path: 'basic-profile',
    loadComponent: () =>
      import('./components/basic-profile/basic-profile.component').then((m) => m.BasicProfileComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
