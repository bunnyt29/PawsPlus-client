import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalConfig} from '../../../models/ModalConfig';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';
import {CommonModule} from '@angular/common';
import {GoogleAutocompleteComponent} from '../../google-autocomplete/google-autocomplete.component';
import {BookingService} from '../../../services/booking.service';
import {ToastrService} from 'ngx-toastr';

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
export class BookingModalComponent {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  bookingForm!: FormGroup;

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
    private toastr: ToastrService
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
      sitterId: this.config.data
    })

    this.bookingService.create(this.bookingForm.value).subscribe( res => {
      this.toastr.success("Успешно изпрати своята заявка! Очаквай потвърждение скоро!");
    })
  }
}
