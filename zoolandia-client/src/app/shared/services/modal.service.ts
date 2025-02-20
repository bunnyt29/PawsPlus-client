import { Injectable } from '@angular/core';
import {ModalConfig} from '../models/ModalConfig';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // isOpen = false;
  // config = new ModalConfig();
  //
  // constructor() {}
  //
  // open(config: ModalConfig) {
  //   this.config = { ...this.config, ...config };
  //   this.isOpen = true;
  // }
  //
  // close() {
  //   this.isOpen = false;
  // }

  public config: ModalConfig = new ModalConfig();

  // Flag to control whether the modal is visible
  public isOpen: boolean = false;

  open(config: ModalConfig): void {
    this.config = config;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
