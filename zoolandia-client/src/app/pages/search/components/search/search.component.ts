import {ChangeDetectorRef, Component, HostListener, NgZone, OnInit} from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {PostService} from '../../../post/services/post.service';
import {GoogleAutocompleteComponent} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {debounceTime, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
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
export class SearchComponent implements OnInit{
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
    disableDefaultUI: true
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
    this.searchSubject.pipe(debounceTime(100)).subscribe(() => {
      this.performSearch();
    });
  }

  ngOnInit() {
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

  onPetTypeChange(value: string) {
    this.searchParams.petType = value;
    this.cdr.detectChanges();
  }

  onStartDateChange(event: any) {
    if (this.searchParams.startDate) {
      this.minDateForEndDate = new Date(this.searchParams.startDate);
    } else {
      this.minDateForEndDate = this.today;
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectOption(option: any, event: Event) {
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

  updatePriceRange(event: any) {
    this.searchParams.minPrice = event.values[0];
    this.searchParams.maxPrice = event.values[1];
  }

  handlePlaceSelected(place: google.maps.places.PlaceResult) {
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

  private performSearch() {
    const params = { ...this.searchParams };
    this.postService.search(params).subscribe(res => {
      this.searchResults = res.posts;
    });
  }

  onSearch() {
    this.searchSubject.next();
  }

  viewProfile(profileId: string) {
    this.router.navigate(['profile/details'], { queryParams: { id: profileId }});
  }
}
