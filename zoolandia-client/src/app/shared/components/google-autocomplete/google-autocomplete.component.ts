import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GoogleMapsModule} from '@angular/google-maps';
import {After} from 'node:v8';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'google-autocomplete',
  standalone: true,
  imports: [
    FormsModule,
    GoogleMapsModule
  ],
  templateUrl: './google-autocomplete.component.html',
  styleUrl: './google-autocomplete.component.scss'
})
export class GoogleAutocompleteComponent  implements AfterViewInit{
  @ViewChild('autocompleteInput', { static: false }) autocompleteInput!: ElementRef;
  @Output() placeSelected = new EventEmitter<any>();
  autocomplete!: google.maps.places.Autocomplete;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.loadGoogleMaps().then(() => {
        this.initAutocomplete();
      }).catch(err => {
        console.error("Google Maps API failed to load", err);
      });
    }
  }

  loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBtnT3myHIQx-EwUs6cDSIXnNkhNRdJpU4&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.nativeElement,
      {
        types: ['(regions)'],
        componentRestrictions: { country: ['BG'] },
        fields: ["address_components", "geometry", "icon", "name"]
      }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.placeSelected.emit(place);
    });
  }
}
