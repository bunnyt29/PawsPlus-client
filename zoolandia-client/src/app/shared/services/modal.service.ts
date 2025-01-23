import { Injectable } from '@angular/core';
import {ModalConfig} from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {  isOpen = false;
  config = new ModalConfig();

  constructor() {}

  open(config: ModalConfig) {
    this.config = { ...this.config, ...config }; // Merge the new config
    this.isOpen = true;
    console.log('ModalService: Opened with config:', this.config);
  }

  close() {
    this.isOpen = false;
  }
}
