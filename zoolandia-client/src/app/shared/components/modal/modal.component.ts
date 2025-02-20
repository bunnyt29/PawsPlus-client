import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ModalService} from '../../services/modal.service';
import {PetService} from '../../../pages/pet/services/pet.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, Validators} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {SharedModule} from '../../shared.module';
import {PostServiceService} from '../../../pages/post/post-services/services/post-service.service';
import {PostService} from '../../models/PostService';
import {Post} from '../../models/Post';
import {BookingService} from '../../services/booking.service';
import {TranslateServicePipe} from '../../pipes/translate-service.pipe';
import {GoogleAutocompleteComponent} from '../google-autocomplete/google-autocomplete.component';

// export class ModalConfig {
//   title?: string = '';
//   description?: string = '';
//   save?: (data: any) => void = () => {};
//   discard?: Function = () => {};
//   data?: any = null;
//   type?: string = '';
//   action?: 'delete' | 'edit' | 'add'| 'details' | 'book' = 'delete';
//
//   constructor(
//     title: string = '',
//     description: string = '',
//     save?: (data: any) => void,
//     discard: Function | null = null,
//     data: any = null,
//     type: string = '',
//     action: 'delete' | 'edit'| 'add'| 'details' | 'book' = 'delete'
//   ) {
//     if (title) this.title = title;
//     if (description) this.description = description;
//     if (save) this.save = save;
//     if (discard) this.discard = discard;
//     this.data = data;
//     this.type = type;
//     this.action = action;
//   }
// }
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule,
    FormsModule,
    TranslateServicePipe,
    GoogleAutocompleteComponent
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  // serviceForm!: FormGroup;
  // bookingForm!: FormGroup;
  // today: Date;
  // postService!: PostService;
  // post!: Post;
  // selectedService: number | null = null;
  //
  // services = [
  //   { id: 1, name: 'DogWalking', imagePath: '/images/desktop/post/service-walking.svg' },
  //   { id: 2, name: 'DailyCare', imagePath: '/images/desktop/post/service-daily-care.svg' },
  //   { id: 3, name: 'PetSitting', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
  //   { id: 4, name: 'Training', imagePath: '/images/desktop/post/service-pet-training.svg' },
  // ];
  //
  // pets = [
  //   { id: 1, name: 'Куче', imagePath: '/images/shared/dog.svg' },
  //   { id: 2, name: 'Котка', imagePath: '/images/shared/cat.svg' },
  // ];
  //
  // meetingPlaceOptions = [
  //   { id: 1, name: 'Взимане лично от собственика' },
  //   { id: 2, name: 'Оставяне в дома на гледача' },
  //   { id: 3, name: 'Взимане от трето място' },
  // ];
  //
  // constructor(
  //   private fb: FormBuilder,
  //   private modalService: ModalService,
  //   private cdr: ChangeDetectorRef,
  //   private petService: PetService,
  //   private postServicesService: PostServiceService,
  //   private bookingService: BookingService,
  //   private toastr: ToastrService,
  //   private router: Router
  // ) {
  //   this.serviceForm = this.fb.group({
  //     id: ['', Validators.required],
  //     price: [0, Validators.required],
  //     availableDates: [[], [Validators.required, Validators.minLength(1)]],
  //     meetingPlaces: this.fb.array([], Validators.required),
  //     serviceType: [null, Validators.required],
  //     postId: ['', Validators.required]
  //   });
  //
  //   this.bookingForm = this.fb.group({
  //     startDay: ['', Validators.required],
  //     startTime: ['', Validators.required],
  //     endDay: ['', Validators.required],
  //     endTime: ['', Validators.required],
  //     meetingPlaceType: [null, Validators.required],
  //     meetingPlaceId: ['', Validators.required],
  //     additionalDescription: [''],
  //     serviceType: [null, Validators.required],
  //     sitterId: ['', Validators.required]
  //   });
  //   this.today = new Date();
  // }
  //
  // ngOnInit() {
  //   this.modalService.open = this.modalService.open.bind(this.modalService);
  //   const originalOpen = this.modalService.open;
  //   this.modalService.open = (config: ModalConfig) => {
  //     originalOpen(config);
  //     if (config.action && ['delete', 'edit', 'add', 'details'].includes(config.action)) {
  //       this.getService();
  //       this.getPost();
  //     }
  //     this.cdr.detectChanges();
  //   };
  // }
  //
  //
  // get open() {
  //   return this.modalService.isOpen;
  // }
  //
  // get config() {
  //   return this.modalService.config;
  // }
  //
  // discardWrapper(event: Event) {
  //   this.modalService.isOpen = false;
  //   if (this.config.discard) {
  //     this.config.discard(event);
  //   }
  //   this.cdr.detectChanges();
  // }
  //
  // // saveWrapper(event: Event) {
  // //   this.modalService.isOpen = false;
  // //   if (this.config.save) {
  // //     this.config.save(event);
  // //   }
  // //   this.cdr.detectChanges();
  // // }
  // isDetailsAction(): boolean {
  //   return this.config.action === 'details';
  // }
  //
  // isDeleteAction(): boolean {
  //   return this.config.action === 'delete';
  // }
  //
  // isEditAction(): boolean {
  //   return this.config.action === 'edit';
  // }
  //
  // isAddAction(): boolean {
  //   return this.config.action === 'add';
  // }
  //
  // isBookAction(): boolean {
  //   return this.config.action === 'book';
  // }
  //
  // selectService(serviceId: number): void {
  //   this.selectedService = serviceId;
  //   this.serviceForm.patchValue({
  //     serviceType: this.selectedService
  //   })
  // }
  //
  // createService(post: Post){
  //   this.serviceForm.patchValue({
  //     'postId': post.id
  //   });
  //   this.postServicesService.create(this.serviceForm.value).subscribe( () => {
  //     this.toastr.success("Успешно добави услуга!");
  //     this.serviceForm.reset();
  //   })
  //   this.modalService.close();
  //   location.reload();
  // }
  // getPost() {
  //   this.post = this.config.data;
  //   console.log(this.post)
  //
  //   const postServiceNames = this.post.services.map((service: any) => service.name);
  //
  //   this.services = this.services.filter(service =>
  //     !postServiceNames.includes(service.name)
  //   );
  //
  //   console.log('Updated services list:', this.services);
  // }
  // getService() {
  //   this.postServicesService.get(this.config.data).subscribe(res => {
  //     this.postService = res;
  //     const formattedDates = this.postService.availableDates.map((dateStr: string) => {
  //       const [year, month, day] = dateStr.split('-').map(Number);
  //       return new Date(year, month - 1, day); // Month is 0-based in JS Dates
  //     });
  //
  //     const meetingPlacesArray = this.serviceForm.get('meetingPlaces') as FormArray;
  //     meetingPlacesArray.clear();
  //     this.postService.meetingPlaces.forEach((place: number) => {
  //       meetingPlacesArray.push(new FormControl(place));
  //     });
  //
  //     this.serviceForm.patchValue({
  //       price: this.postService.price,
  //       availableDates: formattedDates,
  //       serviceType: this.postService.serviceType,
  //       postId: this.postService.postId
  //     })
  //   })
  // }
  // deletePet(petId: string) {
  //   this.petService.delete(petId).subscribe( () => {
  //     this.toastr.success("Успешно изтри домашния си любимец!")
  //     this.router.navigate(['/profile/my-profile-details/my-pets']);
  //   });
  // }
  // deleteService(serviceId: string) {
  //   this.postServicesService.delete(serviceId).subscribe(() => {
  //     this.toastr.success("Успешно изтрита услуга!");
  //   })
  //   this.modalService.close()
  //   location.reload();
  // }
  //
  // editService(serviceId: string) {
  //   let formData = this.serviceForm.value;
  //
  //   const uniqueMeetingPlaces = [...new Set(formData.meetingPlaces)];
  //
  //   this.serviceForm.patchValue({
  //     id: serviceId,
  //     availableDates: formData.availableDates.map((date: Date) =>
  //       date.toISOString().split('T')[0]
  //     ),
  //     meetingPlaces: uniqueMeetingPlaces
  //   });
  //
  //   this.postServicesService.edit(serviceId, this.serviceForm.value).subscribe(() => {
  //     this.toastr.success("Успешно редактира своята услуга!");
  //     this.modalService.close();
  //   });
  // }
  //
  // onMeetingPlaceChange(event: any, place: number) {
  //   const meetingPlaces: FormArray = this.serviceForm.get('meetingPlaces') as FormArray;
  //
  //   if (event.target.checked) {
  //     if (!meetingPlaces.value.includes(place)) {
  //       meetingPlaces.push(new FormControl(place));
  //     }
  //   } else {
  //     const index = meetingPlaces.controls.findIndex(control => control.value === place);
  //     if (index !== -1) {
  //       meetingPlaces.removeAt(index);
  //     }
  //   }
  // }
  //
  // handlePlaceSelected(place: google.maps.places.PlaceResult) {
  //   this.bookingForm.patchValue({
  //     meetingPlaceId: place.place_id
  //   });
  // }
  //
  // formatTime(controlName: string) {
  //   let selectedTime: Date = this.bookingForm.get(controlName)?.value;
  //   if (selectedTime) {
  //     const formattedTime = this.formatToHHMM(selectedTime);
  //     this.bookingForm.patchValue({ [controlName]: formattedTime });
  //   }
  // }
  //
  // formatToHHMM(date: Date): string {
  //   const hours = date.getHours().toString().padStart(2, '0');
  //   const minutes = date.getMinutes().toString().padStart(2, '0');
  //   return `${hours}:${minutes}`;
  // }
  //
  // submitBookingForm() {
  //   this.bookingForm.patchValue({
  //     sitterId: this.config.data
  //   })
  //
  //   console.log(this.bookingForm.value)
  //   // this.bookingService.create(this.bookingForm.value).subscribe( res => {
  //   //   this.toastr.success("Успешно изпрати своята заявка! Очаквай потвърждение скоро!");
  //   // })
  // }
}
