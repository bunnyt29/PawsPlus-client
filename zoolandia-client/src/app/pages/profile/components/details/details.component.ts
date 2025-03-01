import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GoogleMap, MapCircle, MapMarker} from '@angular/google-maps';

import {CalendarModule} from 'primeng/calendar';

import {ProfileService} from '../../services/profile.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

import {environment} from '../../../../../environments/environment';

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
    WrapperModalComponent,
    MapMarker,
    MapCircle
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profileId!: string;
  data!: any;
  placeId: string = '';
  markerPosition: google.maps.LatLngLiteral | null = null;
  circleRadius = 500;
  mapInitialized = false;

  mapOptions: google.maps.MapOptions = {
    mapId: environment.googleMapsMapId,
    center: { lat: 42.68841949999999, lng: 23.2507638 },
    zoom: 13,
    disableDefaultUI: true
  };

  circleOptions: google.maps.CircleOptions = {
    strokeColor: "#FE812D",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FE812D",
    fillOpacity: 0.35,
  };

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.profileId = params['id'];
    });

    this.fetchData();
  }

  ngAfterViewChecked(): void {
    if (this.googleMap && this.googleMap.googleMap && !this.mapInitialized) {
      this.mapInitialized = true;
      this.initializeMap();
    }
  }

  fetchData() {
    this.profileService.get(this.profileId).subscribe(res => {
      this.data = res;
      this.placeId = res.location?.placeId || '';

      if (this.data.post && this.data.post.services) {
        this.data.post.services = this.data.post.services.map((service: any) => {
          if (service.availableDates) {
            service.availableDates = service.availableDates.map((dateStr: string) => new Date(dateStr));
          }
          service.showAvailability = false;
          return service;
        });
      }

      if (this.googleMap && this.googleMap.googleMap) {
        this.initializeMap();
      }
    });
  }

  initializeMap(): void {
    if (!this.googleMap || !this.googleMap.googleMap) {
      return;
    }

    if (!this.placeId) {
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ placeId: this.placeId }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const location = results[0].geometry.location;

        const offsetCenter = google.maps.geometry.spherical.computeOffset(location, Math.random() * 128, 90);
        this.markerPosition = {
          lat: offsetCenter.lat(),
          lng: offsetCenter.lng()
        };

        this.mapOptions = {
          ...this.mapOptions,
          center: this.markerPosition,
          zoom: 15
        };

        this.cd.detectChanges();
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }

  toggleAvailability(service: any): void {
    service.showAvailability = !service.showAvailability;
    this.cd.detectChanges();
  }

  openBookModal(): void {
    this.modalService.open({
      title: 'Резервирай услуга',
      description: 'Попълни формата и изпрати заявка до избрания от теб гледач',
      action: 'book',
      data: {data: this.data, profileId: this.profileId},
      type: 'addPet',
      discard: () => console.log('Delete cancelled'),
    });
  }
}
