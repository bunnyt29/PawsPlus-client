import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from 'primeng/calendar';

import {BookingService} from '../../../services/booking.service';
import {GoogleAutocompleteComponent} from '../../google-autocomplete/google-autocomplete.component';
import {CommonModule} from '@angular/common';
import {ModalConfig} from '../../../models/ModalConfig';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';
import {startWith} from 'rxjs';
import {OverlayPanelModule} from 'primeng/overlaypanel';


@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    TranslateServicePipe,
    GoogleAutocompleteComponent,
    FormsModule,
    OverlayPanelModule
  ],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent implements AfterViewInit, OnInit {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  bookingForm!: FormGroup;
  filteredServices: Array<any> = [];
  filteredMeetingPlaces: Array<{ id: number; name: string }> = [];
  availableDates!: Date[];
  showAvailability: boolean = false;
  today!: Date;
  maxDateForStartDate!: Date;
  minDateForEndDate!: Date;

  services = [
    { id: 1, name: 'DogWalking', imagePath: '/images/desktop/post/service-walking.svg' },
    { id: 2, name: 'DailyCare', imagePath: '/images/desktop/post/service-daily-care.svg' },
    { id: 3, name: 'PetSitting', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
    { id: 4, name: 'Training', imagePath: '/images/desktop/post/service-pet-training.svg' },
  ];

  meetingPlaceOptions = [
    { id: 1, name: 'Взимане лично от собственика' },
    { id: 2, name: 'Оставяне в дома на гледача' },
    { id: 3, name: 'Взимане от трето място' },
  ];
  private isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.today = new Date();
    this.minDateForEndDate = new Date();
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // add 1 hour

    const formatToHHMM = (date: Date): string => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    this.bookingForm = this.fb.group({
      startDay: [new Date(), Validators.required],
      startTime: [formatToHHMM(now), Validators.required],
      endDay: [new Date(), Validators.required],
      endTime: [formatToHHMM(oneHourLater), Validators.required],
      meetingPlaceType: [null, Validators.required],
      meetingPlaceId: [''],
      additionalDescription: [''],
      serviceType: [1, Validators.required],
      sitterId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookingForm.get('serviceType')!
      .valueChanges
      .pipe(startWith(null))
      .subscribe(() => {
        setTimeout(() => this.getFilteredMeetingPlaces());
      });

    this.bookingForm.get('meetingPlaceType')!.valueChanges.subscribe(value => {
      const meetingPlaceIdControl = this.bookingForm.get('meetingPlaceId');

      if (value === 3) {
        meetingPlaceIdControl?.setValidators([Validators.required]);
      } else {
        meetingPlaceIdControl?.clearValidators();
      }

      meetingPlaceIdControl?.updateValueAndValidity();
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getFilteredServices();

      if (this.filteredServices.length) {
        if (!this.bookingForm.value.serviceType) {
          this.bookingForm.patchValue(
            { serviceType: this.filteredServices[0].id },
            { emitEvent: true }
          );
        }
      }
      this.cd.markForCheck();
    });
  }

  get startDay() {
    return this.bookingForm.get('startDay');
  }

  get endDay() {
    return this.bookingForm.get('endDay');
  }

  get startTime() {
    return this.bookingForm.get('startTime');
  }

  get endTime() {
    return this.bookingForm.get('endTime');
  }

  get meetingPlaceType() {
    return this.bookingForm.get('meetingPlaceType');
  }

  get meetingPlaceId() {
    return this.bookingForm.get('meetingPlaceId');
  }

  get serviceType() {
    return this.bookingForm.get('serviceType');
  }

  getFilteredServices(): void {
    const post = this.config?.data?.data?.post;
    if (!post) { return; }

    this.filteredServices = post.services
      .map((srv: any) =>
        this.services.find(s => s.name === srv.name))
      .filter(Boolean) as typeof this.services;
  }

  getFilteredMeetingPlaces(): void {
    const post = this.config?.data?.data?.post;
    if (!post) { this.filteredMeetingPlaces = []; return; }
    const selectedServiceId = this.bookingForm.value.serviceType;
    if (selectedServiceId == null) { this.filteredMeetingPlaces = []; return; }

    const uiService      = this.services.find(s => s.id === selectedServiceId);

    const serviceFromRes = post.services.find((s: any) => s.name === uiService?.name);
    this.availableDates = serviceFromRes.availableDates.map((dateStr: string) => new Date(dateStr));

    if (!serviceFromRes) { this.filteredMeetingPlaces = []; return; }

    this.filteredMeetingPlaces = this.meetingPlaceOptions.filter(mp =>
      serviceFromRes.meetingPlaces.includes(mp.id)
    );

    if (this.filteredMeetingPlaces.length &&
      !this.bookingForm.value.meetingPlaceType) {

      this.bookingForm.patchValue(
        { meetingPlaceType: this.filteredMeetingPlaces[0].id },
        { emitEvent: false }
      );

      if (this.bookingForm.value.meetingPlaceType === 3) {
        const meetingPlaceIdControl = this.bookingForm.get('meetingPlaceId');
        meetingPlaceIdControl?.setValidators([Validators.required]);
        meetingPlaceIdControl?.updateValueAndValidity();
      }
    }

    this.cd.markForCheck();
  }

  onStartDateChange(event: any): void {
    if (this.bookingForm.value.startDay) {
      this.minDateForEndDate = new Date(this.bookingForm.value.startDay);
    } else {
      this.minDateForEndDate = this.today;
    }
  }

  onEndDateChange(event: any): void {
    if (this.bookingForm.value.endDay) {
      this.maxDateForStartDate = new Date(this.bookingForm.value.endDay);
    } else {
      this.maxDateForStartDate = this.today;
    }
  }

  formatTime(controlName: string) {
    let selectedTime: Date = this.bookingForm.get(controlName)?.value;
    if (selectedTime) {
      const formattedTime = this.formatToHHMM(selectedTime);
      this.bookingForm.patchValue({ [controlName]: formattedTime });
    }
  }

  formatToHHMM(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  handlePlaceSelected(place: google.maps.places.PlaceResult) {
    this.bookingForm.patchValue({
      meetingPlaceId: place.place_id
    });
  }

  submitBookingForm() {
    this.isSubmitting = true;
    this.bookingForm.patchValue({
      sitterId: this.config.data.profileId
    });

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastr.error('Моля, попълнете всички задължителни полета.');
      return;
    }

    const parseToDateOnly = (value: any): string | null => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    const formData = {
      ...this.bookingForm.value,
      startDay: parseToDateOnly(this.bookingForm.value.startDay || this.today),
      endDay: parseToDateOnly(this.bookingForm.value.endDay || this.today)
    };

    this.bookingService.create(formData).subscribe(() => {
      this.toastr.success("Успешно изпрати своята заявка! Очаквай потвърждение скоро!");
      this.closeModal.emit();
      this.router.navigate(['/profile/my-profile-details/notifications']);
    });
  }

  toggleAvailableDates() {
    this.showAvailability = !this.showAvailability;
  }
}
