import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {GoogleMapsModule} from '@angular/google-maps';
import {isPlatformBrowser} from '@angular/common';
import {GoogleMapsService} from '../../services/google-maps.service';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private googleMapsService: GoogleMapsService
  ) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.googleMapsService.loadGoogleMaps().then(() => {
        this.initAutocomplete();
      });
    }
  }

  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.nativeElement, {
      types: ['route'],
      componentRestrictions: { country: ['BG'] },
      fields: ['address_components', 'geometry', 'icon', 'name']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.placeSelected.emit(place);
    });
  }
}
