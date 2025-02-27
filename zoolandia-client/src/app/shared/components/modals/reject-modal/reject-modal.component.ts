import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {ModalConfig} from '../../../models/ModalConfig';
import {PostService} from '../../../../pages/post/services/post.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {BookingService} from '../../../services/booking.service';

@Component({
  selector: 'app-reject-modal',
  standalone: true,
  imports: [
    NgIf,
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
      this.router.navigate(['/admin/dashboard']);
    });
  }

  disapproveBooking(data: any) {
    this.bookingService.disapprove(data).subscribe( () => {
      this.toastr.success('Отхвърлихте поръчката');
      this.closeModal.emit();
    })
  }

  cancelBooking(data: any) {
    console.log(data)
    this.bookingService.cancel(data).subscribe( () => {
      this.toastr.success('Отхвърлихте поръчката');
      this.closeModal.emit();
    })
  }
}
