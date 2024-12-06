import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, provideHttpClient} from '@angular/common/http';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [

  ]
})
export class CoreModule { }
