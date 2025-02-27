import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {CommonModule} from '@angular/common';
import {ModalService} from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    GoogleMap,
    MapMarker
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profile!: Profile;
  placeId: string = '';
  formattedAddress!: string | undefined;

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
  ) {}

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];
    let placeId =this.profile.location?.placeId;
    if (placeId) {
      this.placeId = placeId;
    }
  }

  ngAfterViewInit() {
    if (this.googleMap.googleMap) {
      const mapInstance = this.googleMap.googleMap;

      // const service = new google.maps.places.PlacesService(mapInstance);

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

      // service.getDetails({
      //   placeId: this.placeId,
      //   fields: ['geometry', 'name', 'formatted_address']
      // }, (place, status) => {
      //   if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
      //     this.formattedAddress = place.formatted_address;
      //     console.log(place.formatted_address)
      //     console.log(this.formattedAddress)
      //     const location = place.geometry.location;
      //     this.mapOptions = {
      //       ...this.mapOptions,
      //       center: location,
      //       zoom: 15
      //     };
      //
      //     this.markerPosition = { lat: location.lat(), lng: location.lng() };
      //   } else {
      //     console.error('Грешка при взимане на профила.', status);
      //   }
      // });
    }
  }

  openActivateModal() {
    this.modalService.open({
      title: `Активирай профила си`,
      description: 'Профилът ти ще бъде изпратен за одобрение! Администратор ще го прегледа и ще се свърже с теб по имейл, за да уговорите кратко интервю. Това е стандартна процедура за потвърждение на самоличността и проверка на съответствието с изискванията на платформата.',
      action: 'activate',
      discard: () => console.log('Delete cancelled'),
    });
  }
}
