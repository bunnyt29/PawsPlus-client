export interface Review {
  id: string,
  profileId: string,
  photoUrl: string,
  firstName: string,
  lastName: string,
  rating: number,
  content: string,
  reviewDate: Date
}
