import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

import {PostService} from '../../../../pages/post/services/post.service';
import {ToastrService} from 'ngx-toastr';
import {BookingService} from '../../../services/booking.service';
import {ModalConfig} from '../../../models/ModalConfig';

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
  @Output() closeModal = new EventEmitter<void>();
  rejectForm!: FormGroup;

  constructor(
    private postService: PostService,
    private bookingService: BookingService,
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
    this.postService.disapprove(postId, this.rejectForm.value).subscribe(() => {
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
    this.bookingService.disapprove(this.config.data).subscribe( () => {
      this.toastr.success('Отхвърлихте поръчката');
      this.closeModal.emit();
    })
  }

  cancelBooking() {
    this.bookingService.cancel(this.config.data).subscribe( () => {
      this.toastr.success('Отхвърлихте поръчката');
      this.closeModal.emit();
      window.location.reload();
    })
  }
}
