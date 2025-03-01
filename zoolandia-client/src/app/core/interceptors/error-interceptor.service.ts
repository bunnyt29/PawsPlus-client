import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {catchError, Observable, retry, shareReplay, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr : ToastrService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((err: any) => {
        const code = err.error?.problemDetails?.errors?.[0]?.code;
        let message;

        switch (code) {
          case 'Identity.IdentityError':
            message = 'Профила съдържа грешка. Моля, проверете отново.';
            break;
          case 'Identity.UserNotFound':
            message = 'Потребителят не беше намерен.';
            break;
          case 'Identity.InvalidCredentials':
            message = 'Невалидни данни. Моля, проверете и опитайте отново.';
            break;
          case 'Identity.EmailNotUnique':
            message = 'Този имейл вече е използван.';
            break;
          case 'Identity.EmailNotConfirmed':
            message = 'Имейл адресът не е потвърден.';
            break;
          case 'Identity.EmailAlreadyConfirmed':
            message = 'Този имейл вече е потвърден.';
            break;
          case 'Identity.EmailConfirmationFailed':
            message = 'Имейлът не можа да бъде потвърден. Опитайте отново.';
            break;
          case 'Identity.EmailChangeFailed':
            message = 'Неуспешна смяна на имейл. Опитайте по-късно.';
            break;
          case 'Identity.PasswordChangeFailed':
            message = 'Неуспешна смяна на паролата. Опитайте отново.';
            break;
          default:
            if (err.status === 401) {
              message = 'Неуспешен опит за вход!';
              this.router.navigate(['/auth/login']);
            } else if (err.status === 404) {
              message = 'Търсеният от вас резултат не е намерен.';
              this.router.navigate(['/not-found']);
            } else {
              message = 'Възникна проблем! Моля, опитайте отново по-късно.';
            }
            break;
        }

        this.toastr.error(message);
        return throwError(() => err);
      }),
      shareReplay(1)
    );
  }

}
