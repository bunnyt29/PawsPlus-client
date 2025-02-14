export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photoUrl?: string;
  description?: string;
  location?: {
    placeId: string,
    latitude: number,
    longitude: number
  }
  roles?: Array<string>;
}
