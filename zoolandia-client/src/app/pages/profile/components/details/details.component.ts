import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import {CommonModule} from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GoogleMap, MapCircle, MapMarker} from '@angular/google-maps';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {ModalService} from '../../../../shared/services/modal.service';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {GoogleMapsService} from '../../../../shared/services/google-maps.service';
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
    ModalComponent,
    WrapperModalComponent,
    MapMarker,
    MapCircle
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
// export class DetailsComponent implements OnInit, AfterViewInit, AfterViewChecked {
//   @ViewChild(GoogleMap) googleMap!: GoogleMap;
//   profileId!: string;
//   data!: any;
//   placeId: string = '';
//   markerPosition: google.maps.LatLngLiteral | null = null;
//   circleRadius = 500;
//   formattedAddress!: string;
//
//   mapOptions: google.maps.MapOptions = {
//     mapId: environment.googleMapsMapId,
//     center: { lat: 42.68841949999999, lng: 23.2507638 },
//     zoom: 13,
//     disableDefaultUI: true
//   };
//
//   circleOptions: google.maps.CircleOptions = {
//     strokeColor: "#7C7A48",
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: "#7C7A48",
//     fillOpacity: 0.35,
//   };
//
//   mapsParams: {
//     place_id: string | null;
//     fields: string | null;
//     key: string
//   } = {
//     place_id: null,
//     fields: 'geometry/location,place_id,formatted_address',
//     key: environment.googleMapsApiKey
//   };
//
//   constructor(
//     private route: ActivatedRoute,
//     private profileService: ProfileService,
//     private modalService: ModalService,
//     private googleMapsService: GoogleMapsService,
//     private cd: ChangeDetectorRef
//   ) { }
//
//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.profileId = params['id'];
//     })
//
//     this.fetchData();
//   }
//
//   ngAfterViewChecked() {
//     if (this.googleMap && this.googleMap.googleMap && !this.markerPosition) {
//       this.initializeMap();
//     }
//   }
//
//   ngAfterViewInit() {
//     if (this.googleMap.googleMap) {
//       const mapInstance = this.googleMap.googleMap;
//
//       // const service = new google.maps.places.PlacesService(mapInstance);
//       console.log(this.placeId)
//
//       const geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ placeId: this.placeId }, (results, status) => {
//         if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
//           const location = results[0].geometry.location;
//           this.formattedAddress = results[0].formatted_address
//
//           const offsetCenter = google.maps.geometry.spherical.computeOffset(location, Math.random()*128, 90);
//
//           this.mapOptions = {
//             ...this.mapOptions,
//             center: offsetCenter,
//             zoom: 15
//           };
//
//           const circle = new google.maps.Circle({
//             strokeColor: "#FE812D",
//             strokeOpacity: 0.8,
//             strokeWeight: 2,
//             fillColor: "#FE812D",
//             fillOpacity: 0.35,
//             map: this.googleMap.googleMap,
//             center: offsetCenter,
//             radius: 500
//           });
//         } else {
//           console.error('Грешка при взимане на профила.', status);
//         }
//       });
//
//       // service.getDetails({
//       //   placeId: this.placeId,
//       //   fields: ['geometry']
//       // }, (place, status) => {
//       //   if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
//       //     const location = place.geometry.location;
//       //
//       //     //In case not to review the exact address
//       //     const offsetCenter = google.maps.geometry.spherical.computeOffset(location, Math.random()*128, 90);
//       //
//       //     this.mapOptions = {
//       //       ...this.mapOptions,
//       //       center: offsetCenter,
//       //       zoom: 15
//       //     };
//       //
//       //     const circle = new google.maps.Circle({
//       //       strokeColor: "#FE812D",
//       //       strokeOpacity: 0.8,
//       //       strokeWeight: 2,
//       //       fillColor: "#FE812D",
//       //       fillOpacity: 0.35,
//       //       map: this.googleMap.googleMap,
//       //       center: offsetCenter,
//       //       radius: 500
//       //     });
//       //   } else {
//       //     console.error('Грешка при взимане на профила.', status);
//       //   }
//       // });
//     }
//   }
//
//   fetchData() {
//     this.profileService.get(this.profileId).subscribe( res => {
//       this.data = res;
//       this.placeId = res.location.placeId;
//
//       if (this.data.post && this.data.post.services) {
//         this.data.post.services = this.data.post.services.map((service: any) => {
//           if (service.availableDates) {
//             service.availableDates = service.availableDates.map((dateStr: string) => new Date(dateStr));
//           }
//           service.showAvailability = false;
//           return service;
//         });
//       }
//
//       this.mapsParams.place_id = this.data.placeId;
//     })
//   }
//
//   toggleAvailability(service: any) {
//     service.showAvailability = !service.showAvailability;
//     this.cd.detectChanges();
//   }
//
//   openBookModal() {
//     this.modalService.open({
//       title: 'Резервирай услуга',
//       description: 'Попълни формата и изпрати заявка до избрания от теб гледач',
//       action: 'book',
//       data: this.profileId,
//       type: 'addPet',
//       discard: () => console.log('Delete cancelled'),
//     });
//   }
//
// }
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

  initializeMap() {
    if (!this.googleMap || !this.googleMap.googleMap) {
      console.error('Google Map instance not available.');
      return;
    }

    if (!this.placeId) {
      console.error('Missing placeId for geocoding.');
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

  toggleAvailability(service: any) {
    service.showAvailability = !service.showAvailability;
    this.cd.detectChanges();
  }

  openBookModal() {
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
