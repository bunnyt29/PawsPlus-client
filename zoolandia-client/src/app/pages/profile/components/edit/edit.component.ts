import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../../../auth/services/auth.service';
import {ProfileService} from '../../services/profile.service';
import {Profile} from '../../../../shared/models/Profile';
import {SharedModule} from '../../../../shared/shared.module';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {FileService} from '../../../../core/services/file.service';
import {ToastrService} from 'ngx-toastr';
import {GoogleAutocompleteComponent} from '../../../../shared/components/google-autocomplete/google-autocomplete.component';
import {Observable} from 'rxjs';
import {GoogleMap, MapAdvancedMarker} from '@angular/google-maps';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    SharedModule,
    ImageUploadComponent,
    GoogleAutocompleteComponent,
    GoogleMap,
    MapAdvancedMarker
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  profileForm!: FormGroup;
  profile!: Profile;
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  placeId: string = '';
  formattedAddress!: string | undefined;

  markerPosition: google.maps.LatLngLiteral | null = null;

  mapOptions: google.maps.MapOptions = {
    mapId: environment.googleMapsMapId,
    center: { lat: 42.68841949999999, lng: 23.2507638 },
    zoom: 13,
    disableDefaultUI: true
  };

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private fileService: FileService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      'id': [''],
      'firstName': ['', [Validators.required, Validators.minLength(2)]],
      'lastName': ['', [Validators.required, Validators.minLength(2)]],
      'description': [''],
      'location': [null],
      'phoneNumber': ['', [Validators.required, Validators.pattern('^[+]?[0-9]{9,15}$')]],
      'photoUrl': ['']
    });
    this.fetchProfile();
  }

  ngAfterViewInit() {
    if (this.googleMap.googleMap) {
      const mapInstance = this.googleMap.googleMap;

      // const service = new google.maps.places.PlacesService(mapInstance);
      //
      // service.getDetails({
      //   placeId: this.placeId,
      //   fields: ['geometry', 'name', 'formatted_address']
      // }, (place, status) => {
      //   if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
      //     this.formattedAddress = place.formatted_address;
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

  fetchProfile(){
    this.profileService.getMine().subscribe(res => {
      this.profile = res;

      let placeId =this.profile.location?.placeId;
      if (placeId) {
        this.placeId = placeId;
      }

      this.profileForm.patchValue({
        'id': this.profile.id,
        'firstName': this.profile.firstName,
        'lastName': this.profile.lastName,
        'description': this.profile.description,
        'phoneNumber': this.profile.phoneNumber,
        'location': this.profile.location,
        'photoUrl': this.profile.photoUrl
      });
      this.defaultImage = this.profile.photoUrl;
    })
  }

  onFileUpload(file: File): void {
    this.fileService.uploadImage(file).subscribe({
      next: (res) => {
        const photoUrl = res.imageUrl;
        this.profileForm.patchValue({ photoUrl: photoUrl });
      },
      error: (err) => {
        console.error('File upload failed:', err);
      },
    });
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }

  handlePlaceSelected(place: google.maps.places.PlaceResult) {
    if (place.geometry && place.geometry.location) {
      const location = place.geometry.location;

      const latitude = location.lat();
      const longitude = location.lng();


      this.mapOptions = {
        ...this.mapOptions,
        center: { lat: latitude, lng: longitude },
        zoom: 15
      };

      this.markerPosition = { lat: latitude, lng: longitude };

      this.profileForm.patchValue({
        location: {
          placeId: place.place_id,
          latitude: latitude,
          longitude: longitude
        }
      });
    }
  }

  saveChanges(): Observable<any>{
    return this.profileService.edit(this.profile.id, this.profileForm.value);
  }

  navigateToPetCreation() {
    this.saveChanges().subscribe(  {
      next: () => {
        this.toastr.success('Успешно редактира профила си!');
        this.router.navigate(['/pet/create']);
      },
        error: () => {
        this.toastr.error('Невалидни данни!')
      },
    });
  }

  editProfile(){
    this.saveChanges().subscribe( {
      next: () => {
        this.router.navigate(['/profile/my-profile-details']);
    }
    });
  }
}
