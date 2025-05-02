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
  private notificationsPath = environment.apiUrl + "notifications"

  constructor(private http: HttpClient) {}

  async initPushNotifications() {
    if (Capacitor.getPlatform() !== 'web') {
      // Request permission to use push notifications
      let permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === 'granted') {
        // Register with FCM/APNS
        await PushNotifications.register();

        // On successful registration, get the FCM token
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('FCM Token:', token.value);
          // Send the token to your backend
          this.sendTokenToBackend(token.value);
        });

        // Handle registration errors
        PushNotifications.addListener('registrationError', (error: any) => {
          console.error('Error on registration:', error);
        });

        // Handle incoming notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received:', notification);
          // Display notification or update UI
          alert(`${notification?.title || 'Notification'}: ${notification?.body || ''}`);
        });

        // Handle notification tap
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Push action performed:', action);
          // Navigate or perform action based on notification data
        });
      } else {
        console.log('Push notification permission denied');
      }
    }
  }

  private sendTokenToBackend(token: string) {
    // Send token to your ASP.NET API
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
