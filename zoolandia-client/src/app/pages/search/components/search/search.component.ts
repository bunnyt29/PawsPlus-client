import {ChangeDetectorRef, Component, HostListener, NgZone, OnInit} from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {PostService} from '../../../post/services/post.service';
import {
  GoogleAutocompleteComponent
} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';
import {GoogleMapsModule} from '@angular/google-maps';
import {debounceTime, Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

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
  paramsObject: { [key: string]: any } = {};


  serviceOptions = [
    { value: 1, text: 'Разходки', image: '/images/desktop/post/service-walking.svg' },
    { value: 2, text: 'Дневни грижи', image: '/images/desktop/post/service-daily-care.svg' },
    { value: 3, text: 'Престой', image: '/images/desktop/post/service-pet-boarding.svg' },
    { value: 4, text: 'Тренировки', image: '/images/desktop/post/service-pet-training.svg' }
  ];

  mapOptions: google.maps.MapOptions = {
    mapId: "4186b8dc6f3cfdc8",
    center: { lat: 42.6977, lng: 23.3219 },
    zoom: 8,
  };

  searchParams: {
    petType: string | null;
    serviceType: string | null;
    startDate: string | null;
    endDate: string | null;
    minPrice: string | null;
    maxPrice: string | null;
  } = {
    petType: null,
    serviceType: null,
    startDate: null,
    endDate: null,
    minPrice: null,
    maxPrice: null,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    private route: ActivatedRoute
  )
  {
    this.today = new Date();
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.performSearch();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.paramsObject = { ...this.paramsObject, ...queryParams };
      this.searchParams = Object.assign(this.searchParams, queryParams);
      this.selectedOption = this.searchParams.serviceType;
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
    console.log(place)
    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      this.mapOptions = {
        ...this.mapOptions,
        center: { lat: location.lat(), lng: location.lng() },
        zoom: 15
      };
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
}
