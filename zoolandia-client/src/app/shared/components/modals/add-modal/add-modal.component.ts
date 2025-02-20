import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarModule} from "primeng/calendar";
import {CommonModule} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SharedModule} from "../../../shared.module";
import {TranslateServicePipe} from "../../../pipes/translate-service.pipe";
import {ModalConfig} from '../../../models/ModalConfig';
import {Post} from '../../../models/Post';
import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {ToastrService} from 'ngx-toastr';
import {ModalService} from 'ngx-modal-ease';

@Component({
  selector: 'app-add-modal',
  standalone: true,
    imports: [
        CalendarModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        TranslateServicePipe
    ],
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.scss'
})
export class AddModalComponent implements OnInit{
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();

  serviceForm!: FormGroup;
  today: Date = new Date();
  selectedService: number | null = null;
  post!: Post;

  services = [
    { id: 1, name: 'DogWalking', imagePath: '/images/desktop/post/service-walking.svg' },
    { id: 2, name: 'DailyCare', imagePath: '/images/desktop/post/service-daily-care.svg' },
    { id: 3, name: 'PetSitting', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
    { id: 4, name: 'Training', imagePath: '/images/desktop/post/service-pet-training.svg' }
  ];

  meetingPlaceOptions = [
    { id: 1, name: 'Взимане лично от собственика' },
    { id: 2, name: 'Оставяне в дома на гледача' },
    { id: 3, name: 'Взимане от трето място' }
  ];

  constructor(
    private fb: FormBuilder,
    private postServiceService: PostServiceService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      id: ['', Validators.required],
      price: [0, Validators.required],
      availableDates: [[], [Validators.required, Validators.minLength(1)]],
      meetingPlaces: this.fb.array([], Validators.required),
      serviceType: [null, Validators.required],
      postId: ['', Validators.required]
    });
    this.getPost();
  }
  getPost() {
    this.post = this.config.data;

    const postServiceNames = this.post.services.map((service: any) => service.name);

    this.services = this.services.filter(service =>
      !postServiceNames.includes(service.name)
    );
  }
  selectService(serviceId: number): void {
    this.selectedService = serviceId;
    this.serviceForm.patchValue({ serviceType: serviceId });
  }

  onMeetingPlaceChange(event: any, place: number): void {
    const meetingPlaces = this.serviceForm.get('meetingPlaces') as FormArray;
    if (event.target.checked) {
      if (!meetingPlaces.value.includes(place)) {
        meetingPlaces.push(new FormControl(place));
      }
    } else {
      const index = meetingPlaces.controls.findIndex(ctrl => ctrl.value === place);
      if (index !== -1) {
        meetingPlaces.removeAt(index);
      }
    }
  }

  createService(post: Post){
    this.serviceForm.patchValue({
      'postId': post.id
    });
    this.postServiceService.create(this.serviceForm.value).subscribe( () => {
      this.toastr.success("Успешно добави услуга!");
      this.serviceForm.reset();
    })
    this.modalService.close();
  }
}
