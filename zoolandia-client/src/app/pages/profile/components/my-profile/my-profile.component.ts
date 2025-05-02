import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {CommonModule} from '@angular/common';

import {ProfileService} from '../../services/profile.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {Profile} from '../../../../shared/models/Profile';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';
import {Review} from '../../../../shared/models/Review';
import {PrimeTemplate} from 'primeng/api';
import {RatingModule} from 'primeng/rating';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GoogleMap,
    MapMarker,
    WrapperModalComponent,
    PrimeTemplate,
    RatingModule,
    FormsModule
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profile!: Profile;
  placeId: string = '';
  formattedAddress!: string | undefined;
  reviews: Array<Review> | undefined = [];

  markerPosition: google.maps.LatLngLiteral | null = null;

  mapOptions: google.maps.MapOptions = {
    mapId: "4186b8dc6f3cfdc8",
    center: { lat: 42.68841949999999, lng: 23.2507638 },
    zoom: 13,
    disableDefaultUI: true
  };

  constructor(
    private profileService: ProfileService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.profile = this.route.snapshot.data['profile'];
    this.reviews = this.profile.reviews;
    let placeId =this.profile.location?.placeId;
    if (placeId) {
      this.placeId = placeId;
    }
  }

  ngAfterViewInit(): void {
    if (this.googleMap.googleMap) {
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ placeId: this.placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          this.formattedAddress = results[0].formatted_address;
          const location = results[0].geometry.location;
          this.mapOptions = {
            ...this.mapOptions,
            center: location,
            zoom: 15
          };
          this.markerPosition = { lat: location.lat(), lng: location.lng() };
        } else {
          this.formattedAddress = 'Address not found';
        }
      });
    }
  }

  openActivateModal(profileId: string): void {
    this.modalService.open({
      title: `Активирай профила си`,
      description: 'Профилът ти ще бъде изпратен за одобрение! Администратор ще го прегледа и ще се свърже с теб по имейл, за да уговорите кратко интервю. Това е стандартна процедура за потвърждение на самоличността и проверка на съответствието с изискванията на платформата.',
      action: 'activate',
      data: profileId,
      discard: () => console.log('Delete cancelled'),
    });
  }
}
