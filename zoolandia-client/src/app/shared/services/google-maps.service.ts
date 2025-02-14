import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private locationPath = 'https://maps.googleapis.com/maps/api/place/details/json';
  private apiLoaded = false;

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
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBtnT3myHIQx-EwUs6cDSIXnNkhNRdJpU4&libraries=places`;
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

  getLocation(params: any): Observable<any> {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return this.http.get<any>(this.locationPath, { params: httpParams });
  }
}
