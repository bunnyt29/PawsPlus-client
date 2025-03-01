import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProfileRoutingModule} from './profile-routing.module';
import {provideHttpClient} from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class ProfileModule { }
