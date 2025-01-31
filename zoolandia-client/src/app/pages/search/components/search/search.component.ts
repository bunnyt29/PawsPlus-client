import {ChangeDetectorRef, Component, HostListener, NgZone} from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {Gender} from '../../../../shared/models/Gender';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SliderModule} from 'primeng/slider';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PostService} from '../../../post/services/post.service';
import {Post} from '../../../../shared/models/Post';
import {
  GoogleAutocompleteComponent
} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';

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
    GoogleAutocompleteComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  dropdownOpen = false;
  selectedOption: any = null;
  searchResults: Array<any> = [];
  selectedPlace: any = null;


  serviceOptions = [
    { value: 1, text: 'Разходки', image: '/images/desktop/post/service-walking.svg' },
    { value: 2, text: 'Дневни грижи', image: '/images/desktop/post/service-daily-care.svg' },
    { value: 3, text: 'Престой', image: '/images/desktop/post/service-pet-boarding.svg' },
    { value: 4, text: 'Тренировки', image: '/images/desktop/post/service-pet-training.svg' }
  ];

  searchParams: {
    petType: number;
    serviceType: number;
    startDate: string | null;
    endDate: string | null;
    minPrice: number;
    maxPrice: number;
  } = {
    petType: 1,
    serviceType: 1,
    startDate: null,
    endDate: null,
    minPrice: 1,
    maxPrice: 100,
  };

  priceRange: number[] = [0, 200];
  today: Date;

  constructor(
    private cdr: ChangeDetectorRef,
    private postService: PostService,
    public zone: NgZone
  )
  {
    this.today = new Date();
  }

  onPetTypeChange(value: number) {
    this.searchParams.petType = value;
    this.cdr.detectChanges();
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

  handlePlaceSelected(place: any) {
    this.selectedPlace = place;
    console.log('Parent Component Received Place:', place);
  }

  onSearch() {
    console.log(this.searchParams)
    const params = { ...this.searchParams };

    this.postService.search(params).subscribe( res => {
      this.searchResults = res.posts;
      console.log(this.searchResults)
    })
  }
}
