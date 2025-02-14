import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./components/create/create.component').then((m) => m.CreateComponent),
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/edit/edit.component').then((m) => m.EditComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details.component').then((m) => m.DetailsComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetRoutingModule { }
