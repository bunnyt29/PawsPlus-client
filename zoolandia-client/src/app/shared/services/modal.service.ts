import {Injectable} from '@angular/core';

import {ModalConfig} from '../models/ModalConfig';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public config: ModalConfig = new ModalConfig();
  public isOpen: boolean = false;
  public onActionCompleted?: (action: string) => void;

  open(config: ModalConfig, onActionCompleted?: (action: string) => void): void {
    this.config = config;
    this.isOpen = true;
    this.onActionCompleted = onActionCompleted;
  }

  close(): void {
    this.isOpen = false;
    this.onActionCompleted = undefined;
  }
}
