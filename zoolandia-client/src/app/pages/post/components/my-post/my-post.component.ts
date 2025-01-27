import {Component, OnInit} from '@angular/core';
import {Profile} from '../../../../shared/models/Profile';
import {ProfileService} from '../../../profile/services/profile.service';
import {PostService} from '../../services/post.service';
import {Post} from '../../../../shared/models/Post';
import {SharedModule} from '../../../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {ModalService} from '../../../../shared/services/modal.service';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [
    SharedModule,
    ModalComponent
  ],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.scss'
})
export class MyPostComponent implements OnInit {
  profile!: Profile;
  post!: Post;
  postId!: string;

  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];
    this.fetchData();
  }

  fetchData() {
    this.postService.get(this.profile.id).subscribe(res => {
      this.post = res;
      this.postId = res.id;
    })
  }

  openDeleteModal(serviceId: string) {
    this.modalService.open({
      title: 'Изтрий услуга',
      description: 'Сигурен ли си, че искаш да изтриеш тази услуга?',
      action: 'delete',
      data: serviceId,
      type: 'deleteService',
      discard: () => console.log('Delete cancelled'),
    });
  }

  openViewDetailsModal(serviceId: string, serviceName: string) {
    this.modalService.open({
      title: serviceName,
      description: 'Виж подробности за своята услуга.',
      action: 'details',
      data: serviceId,
      type: 'detailsService',
      discard: () => console.log('Delete cancelled'),
    });
  }

  openEditModal(serviceId: string, serviceName: string) {
    this.modalService.open({
      title: 'Редактирай ' + serviceName,
      description: 'Сигурен ли си, че искаш да изтриеш тази услуга?',
      action: 'edit',
      data: serviceId,
      type: 'editService',
      discard: () => console.log('Delete cancelled'),
    });
  }

  openAddNewServiceModal(post: Post) {
    this.modalService.open({
      title: 'Добави нова услуга ',
      description: 'Избери услуга, която искаш да добавиш',
      action: 'add',
      data: post,
      type: 'addService',
      discard: () => console.log('Delete cancelled'),
    });
  }

  openAddNewPetModal(post: Post) {
    this.modalService.open({
      title: 'Добави домашен любимец, за когото ще предлагаш грижи ',
      description: 'Избери домашен любимец',
      action: 'add',
      data: post,
      type: 'addPet',
      discard: () => console.log('Delete cancelled'),
    });
  }
}
