import {ChangeDetectorRef, Component, HostListener, NgZone, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {GoogleMapsModule} from '@angular/google-maps';
import {debounceTime, Subject} from 'rxjs';

import {PostService} from '../../../post/services/post.service';
import {GoogleAutocompleteComponent} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';

import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {SharedModule} from '../../../../shared/shared.module';

import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule,
    ReactiveFormsModule,
    SliderModule,
    FormsModule,
    GoogleMapsModule,
    GoogleAutocompleteComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  private searchSubject = new Subject<void>();
  dropdownOpen = false;
  selectedOption: any = null;
  searchResults: Array<any> = [];
  selectedPlace: any = null;
  priceRange: number[] = [0, 200];
  today: Date;
  minDateForEndDate!: Date;
  formattedAddress: string | undefined = '';
  paramsObject: { [key: string]: any } = {};
  mapMarkers: google.maps.MarkerOptions[] = []

  serviceOptions = [
    { value: 1, text: 'Разходки', image: '/images/desktop/post/service-walking.svg' },
    { value: 2, text: 'Дневни грижи', image: '/images/desktop/post/service-daily-care.svg' },
    { value: 3, text: 'Престой', image: '/images/desktop/post/service-pet-boarding.svg' },
    { value: 4, text: 'Тренировки', image: '/images/desktop/post/service-pet-training.svg' }
  ];

  mapOptions: google.maps.MapOptions = {
    mapId: environment.googleMapsMapId,
    center: { lat: 42.68841949999999, lng: 23.2507638 },
    zoom: 15,
    disableDefaultUI: true,
    clickableIcons: false
  };

  searchParams: {
    petType: string | null;
    serviceType: string | null;
    startDate: string | null;
    endDate: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    latitude: number;
    longitude: number;
    formattedAddress: string | undefined;
  } = {
    petType: null,
    serviceType: null,
    startDate: null,
    endDate: null,
    minPrice: null,
    maxPrice: null,
    latitude: 0,
    longitude: 0,
    formattedAddress: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  )
  {
    this.today = new Date();
    this.searchSubject.pipe(debounceTime(100)).subscribe((): void => {
      this.performSearch();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.paramsObject = { ...this.paramsObject, ...queryParams };
      this.searchParams = Object.assign(this.searchParams, queryParams);
      this.selectedOption = this.serviceOptions.find(option => option.value.toString() === this.searchParams.serviceType);

      const latitude = parseFloat(queryParams['latitude']);
      const longitude = parseFloat(queryParams['longitude']);

      if(this.searchParams.formattedAddress) {
        this.formattedAddress = this.searchParams.formattedAddress;
      }

      if (!isNaN(latitude) && !isNaN(longitude)) {
        this.searchParams.latitude = latitude;
        this.searchParams.longitude = longitude;

        this.mapOptions = {
          ...this.mapOptions,
          center: { lat: latitude, lng: longitude }
        };
      }

      this.onSearch();
    });
  }

  onPetTypeChange(value: string): void {
    this.searchParams.petType = value;
    this.cdr.detectChanges();
  }

  onStartDateChange(event: any): void {
    if (this.searchParams.startDate) {
      this.minDateForEndDate = new Date(this.searchParams.startDate);
    } else {
      this.minDateForEndDate = this.today;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any, event: Event): void {
    event.stopPropagation();
    this.selectedOption = option;
    this.searchParams.serviceType = option.value;
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.custom-dropdown')) {
      this.dropdownOpen = false;
    }
  }

  updatePriceRange(event: any): void {
    this.searchParams.minPrice = event.values[0];
    this.searchParams.maxPrice = event.values[1];
  }

  handlePlaceSelected(place: google.maps.places.PlaceResult): void {
    this.selectedPlace = place;

    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      this.searchParams.latitude = location.lat();
      this.searchParams.longitude = location.lng();

      this.mapOptions = {
        ...this.mapOptions,
        center: { lat: location.lat(), lng: location.lng() },
        zoom: 15
      };

      this.ngZone.run(() => {
        this.onSearch();
      });
    }
  }

  private performSearch(): void {
    const params = { ...this.searchParams };

    this.postService.search(params).subscribe(res => {
      this.searchResults = res.posts;
      this.mapMarkers = [];

      const geocoder = new google.maps.Geocoder();
      let firstLocationSet = false;

      this.searchResults.forEach((result, index) => {
        console.log(result)
        if (result.latitude && result.longitude) {
          this.addMarker(result.latitude, result.longitude, `${result.firstName} ${result.lastName}`, index);

          if (!firstLocationSet) {
            this.mapOptions = {
              ...this.mapOptions,
              center: { lat: result.latitude, lng: result.longitude },
              zoom: 14
            };
            firstLocationSet = true;
          }
        } else if (result.placeId) {
          geocoder.geocode({ placeId: result.placeId }, (geoResults: any, status) => {
            if (status === google.maps.GeocoderStatus.OK && geoResults[0]?.geometry?.location) {
              console.log(geoResults[0])
              const location = geoResults[0].geometry.location;
              this.addMarker(location.lat(), location.lng(), `${result.firstName} ${result.lastName}`, index);

              if (!firstLocationSet) {
                this.mapOptions = {
                  ...this.mapOptions,
                  center: { lat: location.lat(), lng: location.lng() },
                  zoom: 15
                };
                firstLocationSet = true;
              }
            } else {
              console.error(`Failed to geocode placeId ${result.placeId}:`, status);
            }

            if (index === this.searchResults.length - 1) {
              this.cdr.detectChanges();
            }
          });
        }
      });

      this.cdr.detectChanges();
    });
  }



  private addMarker(lat: number, lng: number, title: string, index: number): void {
    const randomOffset = () => (Math.random() - 0.5) * 0.001;

    this.mapMarkers.push({
      position: {
        lat: lat + randomOffset(),
        lng: lng + randomOffset()
      },
      label: (index + 1).toString(),
      title,
      clickable: true
    });
  }

  onSearch(): void {
    this.searchSubject.next();
  }

  viewProfile(profileId: string): void {
    this.router.navigate(['profile/details'], { queryParams: { id: profileId }});
  }
}
