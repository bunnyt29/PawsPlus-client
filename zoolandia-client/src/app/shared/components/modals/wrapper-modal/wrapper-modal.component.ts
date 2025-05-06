import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ModalService} from '../../../services/modal.service';

import {DetailsModalComponent} from '../details-modal/details-modal.component';
import {DeleteModalComponent} from '../delete-modal/delete-modal.component';
import {EditModalComponent} from '../edit-modal/edit-modal.component';
import {AddModalComponent} from '../add-modal/add-modal.component';
import {BookingModalComponent} from '../booking-modal/booking-modal.component';
import {RejectModalComponent} from '../reject-modal/reject-modal.component';
import {ActivateModalComponent} from '../activate-modal/activate-modal.component';
import {ReviewModalComponent} from '../review-modal/review-modal.component';

@Component({
  selector: 'app-wrapper-modal',
  standalone: true,
  imports: [
    CommonModule,
    DetailsModalComponent,
    DeleteModalComponent,
    EditModalComponent,
    AddModalComponent,
    BookingModalComponent,
    RejectModalComponent,
    ActivateModalComponent,
    ReviewModalComponent
  ],
  templateUrl: './wrapper-modal.component.html',
  styleUrls: ['./wrapper-modal.component.scss']
})
export class WrapperModalComponent {
  constructor(public modalService: ModalService) {}

  get config() {
    return this.modalService.config;
  }

  get isOpen() {
    return this.modalService.isOpen;
  }

  closeModal(): void {
    this.modalService.close();
  }

  handleActionCompleted(action: string): void {
    this.modalService.onActionCompleted?.(action);
    this.modalService.close();
  }
}
