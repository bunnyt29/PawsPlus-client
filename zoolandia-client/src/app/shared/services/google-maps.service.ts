import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private apiLoaded = false;
  private baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(
    private http: HttpClient
  ) {
    if (typeof google !== 'undefined' && google.maps) {
      this.apiLoaded = true;
    }
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.apiLoaded) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.apiLoaded = true;
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBtnT3myHIQx-EwUs6cDSIXnNkhNRdJpU4&libraries=places,geometry&language=bg`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.apiLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);

      document.head.appendChild(script);
    });
  }

  getFormattedAddress(placeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?place_id=${placeId}&key=AIzaSyBtnT3myHIQx-EwUs6cDSIXnNkhNRdJpU4`);
  }
}
