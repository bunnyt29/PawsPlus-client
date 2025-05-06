import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {catchError, Observable, retry, shareReplay, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
  private notificationsPath = environment.apiUrl + "/notifications"

  constructor(
    private toastr : ToastrService,
    private router: Router
  ) { }

  private ignoredUrls = [
    `${this.notificationsPath + '/create'}`
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((err: any) => {
        const shouldIgnore = this.ignoredUrls.some(url =>
          req.url.includes(url)
        );

        if (shouldIgnore) {
          // Пропускаме обработката — не показваме тостър, не пренасочваме
          return throwError(() => err);
        }

        const description = err.error?.problemDetails?.errors?.[0]?.description;
        let message = description || 'Възникна проблем! Моля, опитайте отново по-късно.';

        if (err.status === 401) {
          message = 'Неуспешен опит за вход!';
          this.router.navigate(['/access-denied']);
        } else if (err.status === 404) {
          message = description || 'Търсеният от вас резултат не е намерен.';
          this.router.navigate(['/not-found']);
        }

        this.toastr.error(message);
        return throwError(() => err);
      }),
      shareReplay(1)
    );
  }
}
