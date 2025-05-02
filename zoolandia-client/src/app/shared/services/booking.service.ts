import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingPath = environment.apiUrl + "/bookings"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.bookingPath, data);
  }

  getPending():Observable<any> {
    return this.http.get<any>(this.bookingPath + '/pending');
  }

  approve(id: string, data: any): Observable<any> {
    return this.http.patch(this.bookingPath + `/${id}/approve`, data);
  }

  disapprove(data: any): Observable<any> {
    return this.http.patch(this.bookingPath + `/${data.id}/disapprove`, data);
  }

  cancel(data: any): Observable<any> {
    return this.http.patch(this.bookingPath + `/${data.id}/cancel`, data);
  }

  start(id: string): Observable<any> {
    return this.http.patch(this.bookingPath + `/${id}/start`, { id: id });
  }

  complete(id: string): Observable<any> {
    return this.http.patch(this.bookingPath + `/${id}/complete`, { id: id });
  }

  haveCompletedBookings(sitterId: string, ownerId: string) {
    return this.http.get<any>(this.bookingPath + '/haveCompletedBookings', {
      params: {
        sitterId: sitterId,
        ownerId: ownerId
      }
    });
  }

}
