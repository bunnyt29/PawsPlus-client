import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GoogleMap, MapCircle, MapMarker} from '@angular/google-maps';

import {CalendarModule} from 'primeng/calendar';

import {ProfileService} from '../../services/profile.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

import {environment} from '../../../../../environments/environment';
import {Review} from '../../../../shared/models/Review';
import {RatingModule} from 'primeng/rating';
import {ToastrService} from 'ngx-toastr';
import {ReviewService} from '../../../../shared/services/review.service';
import {BookingService} from '../../../../shared/services/booking.service';
import {Observable} from 'rxjs';

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
    MapCircle,
    RatingModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profileId!: string;
  mineId!: string;
  data!: any;
  reviews: Array<Review> = [];
  placeId: string = '';
  markerPosition: google.maps.LatLngLiteral | null = null;
  circleRadius = 500;
  mapInitialized = false;
  reviewForm!: FormGroup;
  canLeaveReview: boolean = false;

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
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private modalService: ModalService,
    private reviewService: ReviewService,
    private bookingService: BookingService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.reviewForm = this.fb.group({
      'rating': [''],
      'content': ['', [Validators.required, Validators.minLength(2)]],
      'reviewerId': ['', [Validators.required]],
      'reviewedId': ['', [Validators.required]],
    })
  }

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
      this.reviews = res.reviews;

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
    this.profileService.getMine().subscribe( res => {
      this.mineId = res.id;

      this.bookingService.haveCompletedBookings(this.profileId, this.mineId).subscribe(result => {
        if (result) {
          const alreadyReviewed = this.reviews.some(review => review.profileId === this.mineId);
          this.canLeaveReview = !alreadyReviewed;
        } else {
          this.canLeaveReview = false;
        }
      });
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

  openDeleteModal(reviewId: string) {
    this.modalService.open({
      title: 'Изтриване на ревю',
      description: 'Сигурен ли си, че искаш да изтриеш ревюто ти?',
      action: 'delete',
      data: reviewId,
      type: 'deleteReview',
      discard: () => this.toastr.info('Изтриването бе отказано!'),
    });
  }

  sendReview(): void {
    this.reviewForm.patchValue({
        'reviewerId': this.mineId,
        'reviewedId': this.profileId
      }
    )
    this.reviewService.create(this.reviewForm.value).subscribe( res => {
      this.toastr.success("Успешно изпратихте своето ревю!");
      window.location.reload();
    })
  }
}
