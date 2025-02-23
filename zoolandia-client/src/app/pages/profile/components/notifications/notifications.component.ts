import {Component, OnInit} from '@angular/core';
import {AnimalTypePipe} from "../../../../shared/pipes/animal-type.pipe";
import {CommonModule} from "@angular/common";
import {TranslateServicePipe} from "../../../../shared/pipes/translate-service.pipe";
import {BookingService} from '../../../../shared/services/booking.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';
import {Profile} from '../../../../shared/models/Profile';

@Component({
  selector: 'app-notifications',
  standalone: true,
    imports: [
        AnimalTypePipe,
        CommonModule,
        TranslateServicePipe
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
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];

    this.fetchData();
  }

  fetchData(){
    this.bookingService.getPending().subscribe(res => {
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
}
