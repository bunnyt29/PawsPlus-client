import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from 'primeng/calendar';

import {ModalConfig} from '../../../models/ModalConfig';
import {PetService} from '../../../../pages/pet/services/pet.service';
import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {PostService} from '../../../models/PostService';
import {ModalService} from '../../../services/modal.service';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    ReactiveFormsModule,
    TranslateServicePipe
  ],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.scss'
})
export class EditModalComponent implements OnInit {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  serviceForm!: FormGroup;
  postService!: PostService;
  today!: Date;

  meetingPlaceOptions = [
    { id: 1, name: 'Взимане лично от собственика' },
    { id: 2, name: 'Оставяне в дома на гледача' },
    { id: 3, name: 'Взимане от трето място' },
  ];

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private postServiceService: PostServiceService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.serviceForm = this.fb.group({
      id: ['', Validators.required],
      price: [0, Validators.required],
      availableDates: [[]],
      meetingPlaces: this.fb.array([], Validators.required),
      serviceType: [null, Validators.required],
      postId: ['', Validators.required]
    });
    this.today = new Date();
  }

  ngOnInit() {
    this.getService();
  }

  get price() {
    return this.serviceForm.get('price');
  }

  get meetingPlaces() {
    return this.serviceForm.get('meetingPlaces');
  }

  getService() {
    this.postServiceService.get(this.config.data).subscribe(res => {
      this.postService = res;
      const today = new Date();
      const formattedDates = this.postService.availableDates
        .map((dateStr: string) => {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        })
        .filter(date => date >= today);

      const meetingPlacesArray = this.serviceForm.get('meetingPlaces') as FormArray;
      meetingPlacesArray.clear();
      this.postService.meetingPlaces.forEach((place: number) => {
        meetingPlacesArray.push(new FormControl(place));
      });

      this.serviceForm.patchValue({
        price: this.postService.price,
        availableDates: formattedDates,
        serviceType: this.postService.serviceType,
        postId: this.postService.postId
      })
      this.cdr.detectChanges();
    })
  }

  editService(serviceId: string) {
    let formData = this.serviceForm.value;

    formData.availableDates = formData.availableDates.filter((date: Date | string) => date !== "" && date !== null);

    formData.availableDates = formData.availableDates.map((date: Date | string) => {
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return date;
    });

    const uniqueMeetingPlaces = [...new Set(formData.meetingPlaces)];

    this.serviceForm.patchValue({
      id: serviceId,
      meetingPlaces: uniqueMeetingPlaces,
      availableDates: formData.availableDates
    });

    this.postServiceService.edit(serviceId, this.serviceForm.value).subscribe(() => {
      this.toastr.success("Успешно редактира своята услуга!");
      this.modalService.close();
      window.location.reload();
    });
  }

  onMeetingPlaceChange(event: any, place: number) {
    const meetingPlaces: FormArray = this.serviceForm.get('meetingPlaces') as FormArray;

    if (event.target.checked) {
      if (!meetingPlaces.value.includes(place)) {
        meetingPlaces.push(new FormControl(place));
      }
    } else {
      const index = meetingPlaces.controls.findIndex(control => control.value === place);
      if (index !== -1) {
        meetingPlaces.removeAt(index);
      }
    }
  }
}
