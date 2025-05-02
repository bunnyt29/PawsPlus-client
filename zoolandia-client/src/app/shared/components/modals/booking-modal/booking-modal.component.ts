import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from 'primeng/calendar';

import {BookingService} from '../../../services/booking.service';
import {GoogleAutocompleteComponent} from '../../google-autocomplete/google-autocomplete.component';
import {CommonModule} from '@angular/common';
import {ModalConfig} from '../../../models/ModalConfig';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';
import {startWith} from 'rxjs';


@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    TranslateServicePipe,
    GoogleAutocompleteComponent
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

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private toastr: ToastrService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      startDay: ['', Validators.required],
      startTime: ['', Validators.required],
      endDay: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingPlaceType: [null, Validators.required],
      meetingPlaceId: ['', Validators.required],
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
    console.log(serviceFromRes)
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
    }

    this.cd.markForCheck();
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
    this.bookingForm.patchValue({
      sitterId: this.config.data.profileId
    })

    this.bookingService.create(this.bookingForm.value).subscribe( () => {
      this.toastr.success("Успешно изпрати своята заявка! Очаквай потвърждение скоро!");
      this.closeModal.emit();
      this.router.navigate(['/profile/my-profile-details/notifications'])
    })
  }
}
