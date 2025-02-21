import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import {TranslateServicePipe} from '../../shared/pipes/translate-service.pipe';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PostRoutingModule
  ]
})
export class PostModule { }
