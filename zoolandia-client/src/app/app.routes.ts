import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: ""
  },
  {
    path: "features",
    // data: { preload: true },
    loadChildren: () => import("./features/features.module").then((m) => m.FeaturesModule)
  }
];
