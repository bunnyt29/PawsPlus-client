export class ModalConfig {
  title: string = '';
  description?: string = '';
  save?: (data: any) => void = () => {};
  discard?: () => void = () => {};
  data?: any = null;
  type?: string = '';
  action?: 'delete' | 'edit' | 'add' | 'details' | 'book' | 'disapprovePost' | 'disapproveBooking'| 'cancel' | 'activate' | 'review' = 'add';

  constructor(
    title: string = '',
    description: string = '',
    save?: (data: any) => void,
    discard?: () => void,
    data?: any,
    type: string = '',
    action: 'delete' | 'edit' | 'add' | 'details' | 'book'| 'disapprovePost'| 'disapproveBooking'| 'cancel' | 'activate' | 'review' = 'add'
  ) {
    this.title = title;
    this.description = description;
    if (save) {
      this.save = save;
    }
    if (discard) {
      this.discard = discard;
    }
    this.data = data;
    this.type = type;
    this.action = action;
  }
}
