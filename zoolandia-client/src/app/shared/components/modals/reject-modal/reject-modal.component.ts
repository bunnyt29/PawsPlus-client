import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

import {PostService} from '../../../../pages/post/services/post.service';
import {ToastrService} from 'ngx-toastr';
import {BookingService} from '../../../services/booking.service';
import {ModalConfig} from '../../../models/ModalConfig';
import {NotificationService} from '../../../services/notification.service';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reject-modal.component.html',
  styleUrl: './reject-modal.component.scss'
})
export class RejectModalComponent {
  @Input() config!: ModalConfig;
  @Output() actionCompleted = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();
  rejectForm!: FormGroup;

  constructor(
    private postService: PostService,
    private bookingService: BookingService,
    private notificationService: NotificationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.rejectForm = this.fb.group({
      'id': [''],
      'stateReason': ['', [Validators.required, Validators.minLength(2)]],
    })
  }
  disapprovePost(postId: string) {
    this.rejectForm.patchValue({
      'id': postId
    });

    const data = {
      profileId: this.config.data.ownerId,
      title: "Профилът не е одобрен",
      body: `Има нужда от корекции, преди да можем да активираме профила ти. Провери имейла си за подробности.`
    }

    this.postService.disapprove(postId, this.rejectForm.value).subscribe(() => {
      this.notificationService.create(data).subscribe(() => {});
      this.toastr.success('Отхвърлихте профила!');
      this.closeModal.emit();
      this.router.navigate(['/admin/dashboard']);

      if (this.router.url === '/admin/dashboard') {
        location.reload();
      } else {
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  disapproveBooking() {
    const bookingData = {
      profileId: this.config.data.ownerId,
      title: "Поръчка отказана",
      body: `Поръчката ви беше отказана. Опитайте с нова дата или се свържете с нас.`
    }

    this.bookingService.disapprove(this.config.data).subscribe( () => {
      this.notificationService.create(bookingData).subscribe(() => {});
      this.toastr.success('Отхвърлихте поръчката');
      this.actionCompleted.emit('disapprove');
      this.closeModal.emit();
    })
  }

  cancelBooking() {
    const bookingData = {
      profileId: this.config.data.sitterId,
      title: "Отказ от страна на клиента",
      body: `Собственикът се отказа от поръчката. Няма нужда от действие от твоя страна.`
    }

    this.bookingService.cancel(this.config.data).subscribe( () => {
      this.toastr.success('Отхвърлихте поръчката');
      this.actionCompleted.emit('cancel');
      this.closeModal.emit();
    })
  }
}
