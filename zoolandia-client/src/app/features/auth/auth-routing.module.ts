import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'role-selection',
    loadComponent: () =>
      import('./components/role-selection/role-selection.component').then((m) => m.RoleSelectionComponent),
  },
  {
    path: 'multi-step-form',
    loadComponent: () =>
      import('./components/multi-step-form/multi-step-form.component').then((m) => m.MultiStepFormComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
