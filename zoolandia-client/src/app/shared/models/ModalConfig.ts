export class ModalConfig {
  title: string = '';
  description?: string = '';
  // A callback that receives form data when saving
  save?: (data: any) => void = () => {};
  // A callback for when the modal is cancelled/discarded
  discard?: () => void = () => {};
  // Any additional data you want to pass to the modal
  data?: any = null;
  type?: string = '';
  // Action determines which modal to show: 'delete', 'edit', 'add', 'details', or 'book'
  action?: 'delete' | 'edit' | 'add' | 'details' | 'book' | 'disapprovePost' | 'disapproveBooking'| 'cancel' | 'activate' = 'add';

  constructor(
    title: string = '',
    description: string = '',
    save?: (data: any) => void,
    discard?: () => void,
    data?: any,
    type: string = '',
    action: 'delete' | 'edit' | 'add' | 'details' | 'book'| 'disapprovePost'| 'disapproveBooking'| 'cancel' | 'activate' = 'add'
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
