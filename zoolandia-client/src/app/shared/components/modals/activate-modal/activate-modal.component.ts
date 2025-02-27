import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalConfig} from '../../../models/ModalConfig';
import {CalendarModule} from 'primeng/calendar';
import {NgForOf, NgIf} from '@angular/common';
import {PaginatorModule} from 'primeng/paginator';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';
import {PostService} from '../../../../pages/post/services/post.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-activate-modal',
  standalone: true,
  imports: [
    CalendarModule,
    NgForOf,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    TranslateServicePipe
  ],
  templateUrl: './activate-modal.component.html',
  styleUrl: './activate-modal.component.scss'
})
export class ActivateModalComponent {
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private postService: PostService,
    private toastr: ToastrService
  ) {
  }

  activate(data: any) {
    this.postService.activate(data).subscribe( () => {
      this.toastr.success('Успешно активирахте профила си! Заявката е изпратена до администратор.');
      this.closeModal.emit();
    })
  }
}
