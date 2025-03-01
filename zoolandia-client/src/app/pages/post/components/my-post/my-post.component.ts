import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {ProfileService} from '../../../profile/services/profile.service';
import {PostService} from '../../services/post.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {Post} from '../../../../shared/models/Post';
import {Profile} from '../../../../shared/models/Profile';
import {SharedModule} from '../../../../shared/shared.module';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [
    SharedModule,
    WrapperModalComponent
  ],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.scss'
})
export class MyPostComponent implements OnInit {
  profile!: Profile;
  post!: Post;
  postId!: string;
  incompleteServices: string[] = [];

  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.profile = this.route.snapshot.data['profile'];
    this.fetchData();
  }

  fetchData(): void {
    this.postService.get(this.profile.id).subscribe(res => {
      this.post = res;
      this.postId = res.id;
      this.checkIncompleteServices();
    })
  }

  checkIncompleteServices(): void {
    this.incompleteServices = this.post.services
      .filter(service => service.price == 0 || service.availableDates == null)
      .map(service => this.getServiceName(service.name));
  }

  getServiceName(serviceName: string): string {
    const serviceMap: { [key: string]: string } = {
      'DogWalking': 'Разходки',
      'DailyCare': 'Дневна грижа',
      'PetSitting': 'Престой',
      'Training': 'Тренировки'
    };
    return serviceMap[serviceName] || serviceName;
  }

  openDeleteModal(type: string, data?: any): void {
    if (type === 'deleteService') {
      this.modalService.open({
        title: 'Изтрий услуга',
        description: 'Сигурен ли си, че искаш да изтриеш тази услуга?',
        action: 'delete',
        data: data,
        type: 'deleteService',
        discard: () => console.log('Delete cancelled'),
      });
    } else if (type === 'deleteAnimal') {
      this.modalService.open({
        title: 'Премахни животно',
        description: 'Това действие ще изтрие животното от списъка с животни, за които предлагаш услуги',
        action: 'delete',
        data: data,
        type: 'deleteAnimal',
        discard: () => console.log('Delete cancelled'),
      });
    }
  }

  openViewDetailsModal(serviceId: string, serviceName: string): void {
    this.modalService.open({
      title: serviceName,
      description: 'Виж подробности за своята услуга.',
      action: 'details',
      data: serviceId,
      type: 'detailsService',
      discard: () => console.log('Delete cancelled'),
    });
  }

  openEditModal(serviceId: string): void {
    this.modalService.open({
      title: `Редактирай услуга`,
      description: 'Сигурен ли си, че искаш да изтриеш тази услуга?',
      action: 'edit',
      data: serviceId,
      type: 'editService',
      discard: () => this.toastr.info('Редактирането бе отказано!'),
    });
  }

  openAddNewServiceModal(post: Post): void {
    this.modalService.open({
      title: 'Добави нова услуга ',
      description: 'Избери услуга, която искаш да добавиш',
      action: 'add',
      data: post,
      type: 'addService',
      discard: () => this.toastr.info('Добавянето на нова услуга бе отказано!'),
    });
  }

  openAddNewPetModal(post: Post): void {
    this.modalService.open({
      title: 'Добави домашен любимец, за когото ще предлагаш грижи ',
      description: 'Избери домашен любимец',
      action: 'add',
      data: post,
      type: 'addAnimal',
      discard: () => console.log('Delete cancelled'),
    });
  }
}
