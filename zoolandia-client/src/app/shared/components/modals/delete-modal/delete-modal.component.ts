import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalConfig} from '../../../models/ModalConfig';
import {NgIf} from '@angular/common';
import {PetService} from '../../../../pages/pet/services/pet.service';
import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ModalService} from '../../../services/modal.service';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [
    NgIf
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
}
