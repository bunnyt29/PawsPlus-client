import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CalendarModule} from "primeng/calendar";
import {GoogleMap, MapCircle} from "@angular/google-maps";
import {CommonModule} from "@angular/common";
import {WrapperModalComponent} from "../../../../shared/components/modals/wrapper-modal/wrapper-modal.component";
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ProfileService} from '../../services/profile.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {FormsModule} from '@angular/forms';
import {PostService} from '../../../post/services/post.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-sitter-details-preview',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    GoogleMap,
    MapCircle,
    WrapperModalComponent,
    RouterLink,
  ],
  templateUrl: './sitter-details-preview.component.html',
  styleUrl: './sitter-details-preview.component.scss'
})
export class SitterDetailsPreviewComponent implements OnInit, AfterViewChecked {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profileId!: string;
  data!: any;
  placeId: string = '';
  markerPosition: google.maps.LatLngLiteral | null = null;
  circleRadius = 500;
  formattedAddress!: string;
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
    private postService: PostService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.profileId = params['id'];
      console.log(this.profileId)
    });

    this.fetchData();
  }

  ngAfterViewChecked(): void {
    if (this.googleMap && this.googleMap.googleMap && !this.mapInitialized) {
      this.mapInitialized = true;
      this.initializeMap();
    }
  }

  fetchData(){
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

  approve(postId: any) {
    this.postService.approve(postId).subscribe(() => {
      this.toastr.success('Активирахте профила!');
      this.router.navigate(['/admin/dashboard']);
    });
  }

  openReasonForRejectModal(postId: string) {
    this.modalService.open({
      title: `Причина за неодобрение`,
      description: 'Опиши причините за неодобрение по ясен и конструктивен начин, така че получателят да разбере конкретно върху какво трябва да работи и как да подобри представянето си.',
      action: 'disapprovePost',
      data: postId,
      discard: () => console.log('Delete cancelled'),
    });
  }

}
