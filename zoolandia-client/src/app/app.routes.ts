import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "home"
  },
  {
    path: "home",
    // data: { preload: true },
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomeModule)
  },
  {
    path: "auth",
    // data: { preload: true },
    loadChildren: () => import("./pages/auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: "profile",
    // data: { preload: true },
    loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfileModule)
  },
  {
    path: "pet",
    // data: { preload: true },
    loadChildren: () => import("./pages/pet/pet.module").then((m) => m.PetModule)
  },
  {
    path: "post",
    // data: { preload: true },
    loadChildren: () => import("./pages/post/post.module").then((m) => m.PostModule)
  }
];
