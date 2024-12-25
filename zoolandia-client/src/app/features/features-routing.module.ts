import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "auth",
    // data: { preload: true },
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: "profile",
    // data: { preload: true },
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule)
  },
  {
    path: "animal",
    // data: { preload: true },
    loadChildren: () => import("./animal/animal.module").then((m) => m.AnimalModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
