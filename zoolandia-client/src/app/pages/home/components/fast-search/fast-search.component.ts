import {ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {CommonModule, NgForOf} from '@angular/common';
import {PostService} from '../../../post/services/post.service';
import {debounceTime} from 'rxjs';
import {CalendarModule} from 'primeng/calendar';
import {SharedModule} from '../../../../shared/shared.module';
import {
  GoogleAutocompleteComponent
} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

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
    startDate: string | null;
    endDate: string | null;
    minPrice: number;
    maxPrice: number;
  } = {
    petType: 0,
    serviceType: 0,
    startDate: null,
    endDate: null,
    minPrice: 1,
    maxPrice: 100,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  )
  {
    this.today = new Date();
  }

  onPetTypeChange(value: number) {
    this.searchParams.petType = value;
    this.cdr.detectChanges();
  }

  onServiceTypeChange(value: number) {
    this.searchParams.serviceType = value;
    this.cdr.detectChanges();
  }

  onStartDateChange(event: any) {
    if (this.searchParams.startDate) {
      this.minDateForEndDate = new Date(this.searchParams.startDate);
    } else {
      this.minDateForEndDate = this.today;
    }
  }

  onSearch(){
    this.router.navigate(['/search'], { queryParams: this.searchParams })
  }
}
