import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';
import {CoreModule} from "../../core/core.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule
  ]
})
export class ProfileModule { }
