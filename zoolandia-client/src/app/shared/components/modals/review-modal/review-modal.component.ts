import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalConfig} from '../../../models/ModalConfig';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {SharedModule} from '../../../shared.module';
import {PostService} from '../../../../pages/post/services/post.service';
import {BookingService} from '../../../services/booking.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {ReviewService} from '../../../services/review.service';
import {RatingModule} from 'primeng/rating';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    SharedModule,
    RatingModule
  ],
  templateUrl: './review-modal.component.html',
  styleUrl: './review-modal.component.scss'
})
export class ReviewModalComponent {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  reviewForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private toastr: ToastrService
  ) {
    this.reviewForm = this.fb.group({
      'rating': [''],
      'content': ['', [Validators.required, Validators.minLength(2)]],
      'reviewerId': ['', [Validators.required]],
      'reviewedId': ['', [Validators.required]],
    })
  }

  sendReview() {
    this.reviewForm.patchValue({
        'reviewerId': this.config.data.reviewerId,
        'reviewedId': this.config.data.reviewedId
      }
    )
    this.reviewService.create(this.reviewForm.value).subscribe( res => {
      this.toastr.success("Успешно изпратихте своето ревю!")
    })
  }
}
