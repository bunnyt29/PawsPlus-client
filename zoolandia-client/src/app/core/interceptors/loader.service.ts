import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, finalize, Observable} from 'rxjs';
import {LoaderService} from '../services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoader = req.headers.get('X-Skip-Loader') === 'true';

    if (!skipLoader) {
      this.loaderService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!skipLoader) {
          this.loaderService.hide();
        }
      })
    );
  }
}
