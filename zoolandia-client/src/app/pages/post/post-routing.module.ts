import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'multi-step-form',
    loadComponent: () =>
      import('./components/multi-step-form/multi-step-form.component').then((m) => m.MultiStepFormComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
