import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from '@angular/router';

import {BookingService} from '../../../../shared/services/booking.service';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';
import {ToastrService} from 'ngx-toastr';
import {ModalService} from '../../../../shared/services/modal.service';
import {Profile} from '../../../../shared/models/Profile';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';
import {AnimalTypePipe} from "../../../../shared/pipes/animal-type.pipe";
import {TranslateServicePipe} from "../../../../shared/pipes/translate-service.pipe";
import {Review} from '../../../../shared/models/Review';
import {NotificationService} from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    AnimalTypePipe,
    CommonModule,
    TranslateServicePipe,
    WrapperModalComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  bookings!: Array<any>;
  profile!: Profile;
  filteredBookings: Array<any> = [];
  activeTab: string = 'Pending';
  reviews: Array<Review> | undefined = [];
  canLeaveReview: boolean = true;

  constructor(
    private bookingService: BookingService,
    private googleMapsService: GoogleMapsService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.profile = this.route.snapshot.data['profile'];

    this.fetchData();
  }

  fetchData(): void {
    this.bookingService.getPending().subscribe(res => {
      this.bookings = res.map((booking: any) => ({ ...booking, meetingPlaceAddress: '' }));
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Pending');
      this.bookings.forEach((booking: any): void => {

        if (booking.googlePlaceId) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ placeId: booking.googlePlaceId }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              booking.meetingPlaceAddress = results[0].formatted_address;
            } else {
              booking.meetingPlaceAddress = 'Address not found';
              console.error('Geocode error:', status);
            }
          });
        }
      });
    });
  }

  filterBookings(status: string): void {
    this.activeTab = status;
    if (status === 'Pending') {
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Pending');
    } else if (status === 'Approved') {
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Approved');
    } else if (status === 'Started') {
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Started');
    } else if (status === 'Canceled') {
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Canceled');
    } else if (status === 'Completed') {
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Completed');
    }
  }

  hasMessages(): boolean {
    return this.filteredBookings.some(b => b.additionalDescription && b.additionalDescription.trim() !== '');
  }

  viewPet(ownerId: string): void {
    this.router.navigate(['/pet/preview'], { queryParams: { ownerId: ownerId } });
  }

  approve(bookingId: string, ownerId: string, serviceName: string): void {
    const data: {id: string, ownerId: string, serviceName: string} =
    {
      id: bookingId,
      ownerId: ownerId,
      serviceName: serviceName
    }

    const bookingData = {
      profileId: ownerId,
      title: "Поръчката ви е одобрена",
      body: `Вашата заявка за ${serviceName} бе одобрена!`
    }

    this.bookingService.approve(bookingId, data).subscribe( (): void => {
      this.notificationService.create(bookingData).subscribe( () => {})
      this.toastr.success('Успешно потвърдихте поръчката!');
      this.activeTab = 'Approved';
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Approved');
      this.cdr.detectChanges();
    })
  }

  openReasonForRejectModal(action: string, bookingId: string, id: string, serviceName: string): void {
    if (action === 'cancel') {
      const data: {id: string, sitterId: string, serviceName: string} =
      {
        id: bookingId,
        sitterId: id,
        serviceName: serviceName
      }
      this.modalService.open({
        title: `Отказване от поръчка`,
        description: 'Сигурен ли си, че искаш да се откажеш от своята поръчка?',
        action: 'cancel',
        data: data,
        discard: () => console.log('Delete cancelled'),
      });
    } else if (action === 'disapprove') {
      const data: {id: string, ownerId: string, serviceName: string} =
      {
        id: bookingId,
        ownerId: id,
        serviceName: serviceName
      }
      this.modalService.open({
        title: `Отхвърляне на поръчка`,
        description: 'Сигурен ли си, че искаш да отхвърлиш своята поръчка?',
        action: 'disapproveBooking',
        data: data,
        discard: () => console.log('Delete cancelled'),
      });
    }
  }
  openReviewModal(reviewerId: string, reviewedId: string): void {
      const data: {reviewerId: string, reviewedId: string} =
        {
          reviewerId: reviewerId,
          reviewedId: reviewedId
        }
      this.modalService.open({
        title: `Остави обратна връзка за този гледач`,
        description: 'Мнението ти е важно за нас и за останалите собственици на домашни любимци! Сподели как преминаха срещите с този гледач – беше ли отговорен, грижовен и внимателен? Всеки коментар помага на общността да направи по-информиран избор.',
        action: 'review',
        data: data,
        discard: () => console.log('Delete cancelled'),
      });
    }

  startBooking(bookingId: string, ownerId: string) {
    const bookingData = {
      profileId: ownerId,
      title: "Твоята поръчка е в процес на изпълнение!",
      body: `Процесът започна – домашният ти любимец вече е в сигурни ръце и всичко върви по план!`
    }

    this.bookingService.start(bookingId).subscribe(() => {
      this.notificationService.create(bookingData).subscribe( () => {})
      this.toastr.success("Поръчката е в процес на изпълнение!");
      this.activeTab = 'Started';
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Started');
      this.cdr.detectChanges();
    })
  }

  completeBooking(bookingId: string, ownerId: string) {
    const bookingData = {
      profileId: ownerId,
      title: "Вашата поръчка бе завършена!",
      body: `Очакваме ви отново скоро! Не забравяйте да оставите обратна връзка, тя е важна за нас!`
    }

    this.bookingService.complete(bookingId).subscribe(() => {
      this.notificationService.create(bookingData).subscribe( () => {})
      this.toastr.success("Поръчката е завършена!");
      this.activeTab = 'Completed';
      this.filteredBookings = this.bookings.filter(booking => booking.status === 'Completed');
      this.cdr.detectChanges();
    })
  }
}
