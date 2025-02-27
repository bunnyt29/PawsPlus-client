import {Component, OnInit} from '@angular/core';
import {AnimalTypePipe} from "../../../../shared/pipes/animal-type.pipe";
import {CommonModule} from "@angular/common";
import {TranslateServicePipe} from "../../../../shared/pipes/translate-service.pipe";
import {BookingService} from '../../../../shared/services/booking.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';
import {Profile} from '../../../../shared/models/Profile';
import {ToastrService} from 'ngx-toastr';
import {ModalService} from '../../../../shared/services/modal.service';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

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
export class NotificationsComponent implements OnInit{
  bookings!: Array<any>;
  profile!: Profile;

  constructor(
    private bookingService: BookingService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];

    this.fetchData();
  }

  fetchData(){
    this.bookingService.getPending().subscribe(res => {
      console.log(res)
      this.bookings = res.map((booking: any) => ({ ...booking, meetingPlaceAddress: '' }));

      this.bookings.forEach((booking: any) => {
        if (booking.meetingPlaceId) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ placeId: booking.meetingPlaceId }, (results, status) => {
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

  viewPet(ownerId: string){
    this.router.navigate(['/pet/details', ownerId])
  }

  approve(bookingId: string, ownerId: string) {
    const data: {id: string, ownerId: string} =
    {
      id: bookingId,
      ownerId: ownerId
    }
    this.bookingService.approve(bookingId, data).subscribe( () => {
      this.toastr.success('Успешно потвърдихте поръчката!');
    })
  }

  openReasonForRejectModal(action: string, bookingId: string, id: string) {
    console.log('opened')
    if (action === 'cancel') {
      const data: {id: string, sitterId: string} =
      {
        id: bookingId,
        sitterId: id
      }
      this.modalService.open({
        title: `Отказване от поръчка`,
        description: 'Сигурен ли си, че искаш да се откажеш от своята поръчка?',
        action: 'cancel',
        data: data,
        discard: () => console.log('Delete cancelled'),
      });
    } else if (action === 'disapprove') {
      const data: {id: string, ownerId: string} =
      {
        id: bookingId,
        ownerId: id
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
}
