import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalConfig} from '../../../models/ModalConfig';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {PetService} from '../../../../pages/pet/services/pet.service';
import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {ModalService} from '../../../services/modal.service';
import {PostService} from '../../../../pages/post/services/post.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private petService: PetService,
    private postServiceService: PostServiceService,
    private postService: PostService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }
  deletePet(petId: string) {
      this.petService.delete(petId).subscribe( () => {
        this.toastr.success("Успешно изтри домашния си любимец!")
        this.router.navigate(['/profile/my-profile-details/my-pets']);
      });
    }

  deleteService(serviceId: string) {
    this.postServiceService.delete(serviceId).subscribe(() => {
      this.toastr.success("Успешно изтрита услуга!");
      this.closeModal.emit();
      location.reload();
    });
  }

  deleteAnimal() {
    this.postService.delete(this.config.data).subscribe(() => {
      this.toastr.success("Успешно изтрито животно!");
      this.closeModal.emit();
      location.reload();
    })
  }
}
