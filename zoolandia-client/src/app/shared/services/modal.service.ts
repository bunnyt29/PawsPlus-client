import {Injectable} from '@angular/core';

import {ModalConfig} from '../models/ModalConfig';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public config: ModalConfig = new ModalConfig();

  public isOpen: boolean = false;

  open(config: ModalConfig): void {
    this.config = config;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}
