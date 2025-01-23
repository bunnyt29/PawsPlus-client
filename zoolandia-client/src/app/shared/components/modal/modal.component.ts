import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {CommonModule} from '@angular/common';
import {ModalService} from '../../services/modal.service';
import {PetService} from '../../../pages/pet/services/pet.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

export class ModalConfig {
  title?: string = '';
  description?: string = '';
  save?: Function = () => {}; // Callback for primary action
  discard?: Function = () => {}; // Callback for closing the modal
  data?: any = null; // For passing dynamic data like petId
  action?: 'delete' | 'edit' = 'delete'; // To differentiate between actions

  constructor(
    title: string = '',
    description: string = '',
    save: Function | null = null,
    discard: Function | null = null,
    data: any = null,
    action: 'delete' | 'edit' = 'delete'
  ) {
    if (title) this.title = title;
    if (description) this.description = description;
    if (save) this.save = save;
    if (discard) this.discard = discard;
    this.data = data;
    this.action = action;
  }
}
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit{
  constructor(
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private petService: PetService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  get open() {
    console.log('Modal open:', this.modalService.isOpen);
    return this.modalService.isOpen;
  }

  get config() {
    return this.modalService.config;
  }

  discardWrapper(event: Event) {
    this.modalService.isOpen = false;
    if (this.config.discard) {
      this.config.discard(event);
    }
    this.cdr.detectChanges(); // Force change detection
  }

  saveWrapper(event: Event) {
    this.modalService.isOpen = false;
    if (this.config.save) {
      this.config.save(event);
    }
    this.cdr.detectChanges(); // Force change detection
  }

  ngOnInit() {
    // Ensure Angular detects changes when modal state updates
    this.modalService.open = this.modalService.open.bind(this.modalService);
    const originalOpen = this.modalService.open;
    this.modalService.open = (config: ModalConfig) => {
      originalOpen(config);
      this.cdr.detectChanges(); // Trigger change detection
    };
  }

  deletePet(petId: string) {
    this.petService.delete(petId).subscribe( res => {
      this.toastr.success("Успешно изтри домашния си любимец!")
    })
    this.modalService.close();
    this.router.navigate(['/my-profile-details/my-pets']);
  }
}
