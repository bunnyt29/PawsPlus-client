import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ModalService} from '../../services/modal.service';
import {PetService} from '../../../pages/pet/services/pet.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import {SharedModule} from '../../shared.module';
import {PostServiceService} from '../../../pages/post/post-services/services/post-service.service';
import {PostService} from '../../models/PostService';
import {Post} from '../../models/Post';

export class ModalConfig {
  title?: string = '';
  description?: string = '';
  save?: Function = () => {};
  discard?: Function = () => {};
  data?: any = null;
  type: string = '';
  action?: 'delete' | 'edit' | 'add'| 'details' = 'delete';

  constructor(
    title: string = '',
    description: string = '',
    save: Function | null = null,
    discard: Function | null = null,
    data: any = null,
    type: string = '',
    action: 'delete' | 'edit'| 'add'| 'details' = 'delete'
  ) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (save) this.save = save;
    if (discard) this.discard = discard;
    this.data = data;
    this.type = type;
    this.action = action;
  }
}
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule,
    FormsModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  serviceForm!: FormGroup;
  today: Date;
  postService!: PostService;
  post!: Post;
  selectedService: string | null = null;

  services = [
    { id: 1, name: 'DogWalking', imagePath: '/images/desktop/post/service-walking.svg' },
    { id: 2, name: 'DailyCare', imagePath: '/images/desktop/post/service-daily-care.svg' },
    { id: 3, name: 'PetSitting', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
    { id: 4, name: 'Training', imagePath: '/images/desktop/post/service-pet-training.svg' },
  ];

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private petService: PetService,
    private postServicesService: PostServiceService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.serviceForm = this.fb.group({
      id: ['', Validators.required],
      price: [0, Validators.required],
      availableDates: [[], [Validators.required, Validators.minLength(1)]],
      serviceType: [null, Validators.required],
      postId: ['', Validators.required]
    })
    this.today = new Date();
  }

  get open() {
    console.log('Modal open:', this.modalService.isOpen);
    return this.modalService.isOpen;
  }

  get config() {
    return this.modalService.config;
  }

  discardWrapper(event: Event) {
    this.modalService.isOpen = false;
    if (this.config.discard) {
      this.config.discard(event);
    }
    this.cdr.detectChanges();
  }

  // saveWrapper(event: Event) {
  //   this.modalService.isOpen = false;
  //   if (this.config.save) {
  //     this.config.save(event);
  //   }
  //   this.cdr.detectChanges();
  // }

  ngOnInit() {
    this.modalService.open = this.modalService.open.bind(this.modalService);
    const originalOpen = this.modalService.open;
    this.modalService.open = (config: ModalConfig) => {
      originalOpen(config);
      this.cdr.detectChanges();
      this.getService();
      this.getPost();
    };
  }

  isDetailsAction(): boolean {
    return this.config.action === 'details';
  }

  isDeleteAction(): boolean {
    return this.config.action === 'delete';
  }

  isEditAction(): boolean {
    return this.config.action === 'edit';
  }

  isAddAction(): boolean {
    return this.config.action === 'add';
  }

  getPost() {
    this.post = this.config.data;
    console.log(this.post)

    const postServiceNames = this.post.services.map((service: any) => service.name);

    this.services = this.services.filter(service =>
      !postServiceNames.includes(service.name)
    );

    console.log('Updated services list:', this.services);
  }
  getService() {
    this.postServicesService.get(this.config.data).subscribe(res => {
      this.postService = res;
      const formattedDates = this.postService.availableDates.map(date => new Date(date));

      this.serviceForm.patchValue({
        price: this.postService.price,
        availableDates: formattedDates,
        serviceType: this.postService.serviceType,
        postId: this.postService.postId
      })
    })
  }
  deletePet(petId: string) {
    this.petService.delete(petId).subscribe( () => {
      this.toastr.success("Успешно изтри домашния си любимец!")
    })
    this.modalService.close();
    this.router.navigate(['/my-profile-details/my-pets']);
  }

  deleteService(serviceId: string) {
    this.postServicesService.delete(serviceId).subscribe(() => {
      this.toastr.success("Успешно изтрита услуга!");
    })
  }

  editService(serviceId: string) {
    this.serviceForm.patchValue({
      id: serviceId
    })
    this.postServicesService.edit(serviceId, this.serviceForm.value).subscribe(res => {
      this.toastr.success("Успешно редактира своята услуга!");
      this.modalService.close();
    })
  }
}
