import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import {CommonModule} from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GoogleMap} from '@angular/google-maps';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {Post} from '../../../../shared/models/Post';
import {ModalService} from '../../../../shared/services/modal.service';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMap,
    NavigationMenuComponent,
    ModalComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  profileId!: string;
  data!: any;
  mapOptions: google.maps.MapOptions = {
    mapId: "4186b8dc6f3cfdc8",
    center: { lat: 42.68841949999999, lng: 23.2507638 },
    zoom: 13,
    disableDefaultUI: true
  };

  mapsParams: {
    place_id: string | null;
    fields: string | null;
    key: string
  } = {
    place_id: null,
    fields: 'geometry/location,place_id,formatted_address',
    key: 'AIzaSyBtnT3myHIQx-EwUs6cDSIXnNkhNRdJpU4'
  };

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private modalService: ModalService,
    private googleMapsService: GoogleMapsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.profileId = params['id'];
    })

    this.fetchData();
  }

  fetchData() {
    this.profileService.get(this.profileId).subscribe( res => {
      this.data = res;

      if (this.data.post && this.data.post.services) {
        this.data.post.services = this.data.post.services.map((service: any) => {
          if (service.availableDates) {
            service.availableDates = service.availableDates.map((dateStr: string) => new Date(dateStr));
          }
          service.showAvailability = false;
          return service;
        });
      }

      this.mapsParams.place_id = this.data.placeId;
      console.log(this.mapsParams)
    })
  }

  toggleAvailability(service: any) {
    service.showAvailability = !service.showAvailability;
    this.cd.detectChanges();
  }

  openBookModal() {
    this.modalService.open({
      title: 'Резервирай услуга',
      description: 'Попълни формата и изпрати заявка до избрания от теб гледач',
      action: 'book',
      type: 'addPet',
      discard: () => console.log('Delete cancelled'),
    });
  }

}
