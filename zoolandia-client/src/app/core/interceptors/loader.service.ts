import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {LoaderService} from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoader = req.headers.get('X-Skip-Loader') === 'true';
    let loaderShown = false;
    let timer: any;

    if (!skipLoader) {
      timer = setTimeout(() => {
        this.loaderService.show();
        loaderShown = true;
      }, 300);
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (timer) {
          clearTimeout(timer);
        }
        if (loaderShown) {
          this.loaderService.hide();
        }
      })
    );
  }
}
