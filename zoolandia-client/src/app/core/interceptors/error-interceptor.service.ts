import { Injectable } from '@angular/core';
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
        let message = "";
        if (err.status === 401) {
          message = "Неуспешен опит за вход!";
          this.router.navigate(['/auth/login']);
        }
        else if (err.status === 404) {
          message = "Търсеният от вас резултат не е намерен.";
        }
        else if (err.status === 400) {
          message = "Заявката, която искате да извършите е невалидна.";
        }
        else {
          message = "Възникна проблем! Моля, опитайте отново по-късно.";
        }

        this.toastr.error(message)

        return throwError(() => err);
      }),
      shareReplay(1)
    )
  }

}
