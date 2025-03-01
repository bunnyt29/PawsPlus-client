import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from 'primeng/calendar';

import {BookingService} from '../../../services/booking.service';
import {GoogleAutocompleteComponent} from '../../google-autocomplete/google-autocomplete.component';
import {CommonModule} from '@angular/common';
import {ModalConfig} from '../../../models/ModalConfig';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';


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
export class BookingModalComponent implements AfterViewInit {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  bookingForm!: FormGroup;
  filteredServices: Array<any> = [];

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
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      startDay: ['', Validators.required],
      startTime: ['', Validators.required],
      endDay: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingPlaceType: [null, Validators.required],
      meetingPlaceId: ['', Validators.required],
      additionalDescription: [''],
      serviceType: [null, Validators.required],
      sitterId: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getFilteredServices();
    });
  }

  getFilteredServices() {
    if (!this.config || !this.config.data || !this.config.data.data || !this.config.data.data.post) {
      console.error('config.data.data.post is missing or undefined');
      return;
    }

    this.filteredServices = this.config.data.data.post.services.map((serviceFromRes: any) =>
      this.services.find(service => service.name.includes(serviceFromRes.name))
    ).filter((service: any) => service);
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
