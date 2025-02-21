import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    RouterLink,
    GoogleMap,
    NgIf,
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

      const service = new google.maps.places.PlacesService(mapInstance);

      service.getDetails({
        placeId: this.placeId,
        fields: ['geometry', 'name', 'formatted_address']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          this.formattedAddress = place.formatted_address;
          console.log(place.formatted_address)
          console.log(this.formattedAddress)
          const location = place.geometry.location;
          this.mapOptions = {
            ...this.mapOptions,
            center: location,
            zoom: 15
          };

          this.markerPosition = { lat: location.lat(), lng: location.lng() };
        } else {
          console.error('Грешка при взимане на профила.', status);
        }
      });
    }
  }
}
