import { Injectable } from '@angular/core';
import {PushNotifications, Token} from '@capacitor/push-notifications';
import {HttpClient} from '@angular/common/http';
import {Capacitor} from '@capacitor/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsPath = environment.apiUrl + "/notifications"

  constructor(private http: HttpClient) {}

  async initPushNotifications() {
    if (Capacitor.getPlatform() !== 'web') {
      let permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === 'granted') {
        await PushNotifications.register();

        PushNotifications.addListener('registration', (token: Token) => {
          console.log('FCM Token:', token.value);
          this.sendTokenToBackend(token.value);
        });

        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration:', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received:', notification);
          alert(`${notification?.title || 'Notification'}: ${notification?.body || ''}`);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push action performed:', action);
        });
      } else {
        console.log('Push notification permission denied');
      }
    }
  }

  private sendTokenToBackend(token: string) {
    this.http
      .post(this.notificationsPath + '/registerDevice', { deviceToken: token })
      .subscribe({
        next: () => console.log('Token sent to backend'),
        error: (err) => console.error('Error sending token:', err),
      });
  }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.notificationsPath + '/create', data);
  }
}
