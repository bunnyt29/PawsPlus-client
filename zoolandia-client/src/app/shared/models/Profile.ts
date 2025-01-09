export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoUrl?: string;
  description?: string;
  roles?: Array<string>;
}
