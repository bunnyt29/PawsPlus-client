import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

import {CalendarModule} from 'primeng/calendar';
import {PaginatorModule} from 'primeng/paginator';

import {PostService} from '../../../../pages/post/services/post.service';
import {ModalConfig} from '../../../models/ModalConfig';
import {TranslateServicePipe} from '../../../pipes/translate-service.pipe';

@Component({
  selector: 'app-activate-modal',
  standalone: true,
  imports: [
    CalendarModule,
    CommonModule,
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
  ) { }

  activate(data: any): void {
    this.postService.activate(data).subscribe( () => {
      this.toastr.success('Успешно активирахте профила си! Заявката е изпратена до администратор.');
      this.closeModal.emit();
      window.location.reload();
    })
  }
}
