import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from "primeng/calendar";

import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {ModalService} from 'ngx-modal-ease';
import {PostService} from '../../../../pages/post/services/post.service';
import {SharedModule} from "../../../shared.module";
import {Post} from '../../../models/Post';
import {ModalConfig} from '../../../models/ModalConfig';
import {TranslateServicePipe} from "../../../pipes/translate-service.pipe";

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
export class AddModalComponent implements OnInit {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();

  serviceForm!: FormGroup;
  today: Date = new Date();
  selectedService: number | null = null;
  selectedPet: number | null = null;
  selectedWeights: number[] = [];
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

  pets = [
    { id: 1, name: 'Куче', imagePath: '/images/shared/dog.svg' },
    { id: 2, name: 'Котка', imagePath: '/images/shared/cat.svg' },
  ];

  weights = [
    { id: 1, name: 'Малко', value: '0-7 кг.' },
    { id: 2, name: 'Средно', value: '8-20 кг.' },
    { id: 3, name: 'Голямо', value: '21-50 кг.' },
    { id: 4, name: 'Много голямо', value: '50+ кг.' },
  ];

  constructor(
    private fb: FormBuilder,
    private postServiceService: PostServiceService,
    private postService: PostService,
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      price: [null, Validators.required],
      availableDates: [[]],
      meetingPlaces: this.fb.array([], Validators.required),
      serviceType: [null, Validators.required],
      postId: ['', Validators.required]
    });
    this.getPost();
  }

  get price() {
    return this.serviceForm.get('price');
  }

  get meetingPlaces() {
    return this.serviceForm.get('meetingPlaces');
  }

  getPost(): void {
    this.post = this.config.data;

    const postServiceNames = this.post.services.map((service: any) => service.name);
    const excludedPetIds = new Set(this.post.pets);

    this.services = this.services.filter(service =>
      !postServiceNames.includes(service.name)
    );

    this.pets = this.pets.filter(pet => !excludedPetIds.has(pet.id));
  }

  selectService(serviceId: number): void {
    this.selectedService = serviceId;
    this.serviceForm.patchValue({ serviceType: serviceId });
  }

  selectPet(petId: number): void {
    this.selectedPet = petId;

    if (petId === 1) {
      this.selectedWeights = [];
    }
  }

  onWeightChange(event: any, weightId: number): void {
    const index = this.selectedWeights.indexOf(weightId);

    if (index === -1) {
      this.selectedWeights.push(weightId);
    } else {
      this.selectedWeights.splice(index, 1);
    }
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

    if (this.serviceForm.invalid){
      this.serviceForm.markAllAsTouched();
      return;
    } else {
      this.postServiceService.create(this.serviceForm.value).subscribe( () => {
        this.toastr.success("Успешно добави услуга!");
        this.serviceForm.reset();
        this.modalService.close();
        window.location.reload();
      })
    }
  }

  editPost(): void {
    if (!this.selectedPet) {
      this.toastr.error("Моля, изберете животно.");
      return;
    }

    const updatedData = {
      id: this.config.data.id,
      animalTypeId: this.selectedPet,
      weights: this.selectedPet === 1 ? this.selectedWeights : []
    };

    this.postService.edit(updatedData.id, updatedData).subscribe(() => {
      this.toastr.success("Успешно обновено!");
      this.modalService.close();
      window.location.reload();
    }, () => {
      this.toastr.error("Възникна грешка при обновяването.");
    });
  }
}
