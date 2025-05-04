import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./components/create/create.component').then((m) => m.CreateComponent),
    data: { allowedRoles: ['Owner'] }
  },
  {
    path: 'edit',
    loadComponent: () =>
      import('./components/edit/edit.component').then((m) => m.EditComponent),
    data: { allowedRoles: ['Owner'] }
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/details/details.component').then((m) => m.DetailsComponent),
    data: { allowedRoles: ['Owner'] }
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./components/preview/preview.component').then((m) => m.PreviewComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PetRoutingModule { }
