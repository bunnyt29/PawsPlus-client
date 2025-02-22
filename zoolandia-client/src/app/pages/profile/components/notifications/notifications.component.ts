import {Component, OnInit} from '@angular/core';
import {AnimalTypePipe} from "../../../../shared/pipes/animal-type.pipe";
import {CommonModule} from "@angular/common";
import {TranslateServicePipe} from "../../../../shared/pipes/translate-service.pipe";
import {BookingService} from '../../../../shared/services/booking.service';
import {Router} from '@angular/router';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';

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

  constructor(
    private bookingService: BookingService,
    private googleMapsService: GoogleMapsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData(){
    this.bookingService.getPending().subscribe(res => {
      this.bookings = res;
      this.bookings = res.map((booking:any) => ({ ...booking, meetingPlaceAddress: '' }));

      this.bookings.forEach((booking:any)=> {
        if (booking.meetingPlaceId) {
          this.googleMapsService.getFormattedAddress(booking.meetingPlaceId).subscribe(response => {
            if (response.results.length > 0) {
              console.log(booking.meetingPlaceAddress = response.results[0].formatted_address);
              booking.meetingPlaceAddress = response.results[0].formatted_address;
            } else {
              booking.meetingPlaceAddress = 'Address not found';
            }
          });
        }
      });
    })
  }

  viewPet(ownerId: string){
    this.router.navigate(['/pet/details', ownerId])
  }
}
