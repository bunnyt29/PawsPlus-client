import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

import {CalendarModule} from 'primeng/calendar';
import {SharedModule} from '../../../../shared/shared.module';
import {GoogleAutocompleteComponent} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';

@Component({
  selector: 'fast-search',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    CalendarModule,
    GoogleAutocompleteComponent
  ],
  templateUrl: './fast-search.component.html',
  styleUrl: './fast-search.component.scss'
})
export class FastSearchComponent {
  today: Date;
  minDateForEndDate!: Date;

  pets = [
    { id: 1, name: 'Куче', imagePath: '/images/shared/dog.svg' },
    { id: 2, name: 'Котка', imagePath: '/images/shared/cat.svg' },
  ];

  services = [
    { id: 1, name: 'Разходка', imagePath: '/images/desktop/post/service-walking.svg' },
    { id: 2, name: 'Дневна грижа', imagePath: '/images/desktop/post/service-daily-care.svg' },
    { id: 3, name: 'Престой', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
    { id: 4, name: 'Тренировки', imagePath: '/images/desktop/post/service-pet-training.svg' },
  ];

  searchParams: {
    petType: number;
    serviceType: number;
    startDate: Date | null;
    endDate: Date | null;
    minPrice: number;
    maxPrice: number;
    latitude: number;
    longitude: number;
    formattedAddress: string | undefined;
  } = {
    petType: 0,
    serviceType: 0,
    startDate: new Date(),
    endDate: new Date(),
    minPrice: 1,
    maxPrice: 100,
    latitude: 0,
    longitude: 0,
    formattedAddress: undefined
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.today = new Date();
    this.minDateForEndDate = new Date();
  }

  onPetTypeChange(value: number): void {
    this.searchParams.petType = value;
    this.cdr.detectChanges();
  }

  onServiceTypeChange(value: number): void {
    this.searchParams.serviceType = value;
    this.cdr.detectChanges();
  }

  onStartDateChange(event: any): void {
    if (this.searchParams.startDate) {
      this.minDateForEndDate = new Date(this.searchParams.startDate);
    } else {
      this.minDateForEndDate = this.today;
    }
  }

  onPlaceSelected(place: google.maps.places.PlaceResult): void {
    this.searchParams.formattedAddress = place.formatted_address;
    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;
      this.searchParams.latitude = location.lat();
      this.searchParams.longitude = location.lng();
    }
  }
  onSearch(): void {
    const parseToDateOnly = (value: any): string | null => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const queryParams = {
      ...this.searchParams,
      startDate: parseToDateOnly(this.searchParams.startDate),
      endDate: parseToDateOnly(this.searchParams.endDate)
    };
    this.router.navigate(['/search'], { queryParams });
  }
}
