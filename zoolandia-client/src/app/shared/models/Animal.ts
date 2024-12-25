import {PetType} from './PetType';
import {Gender} from './Gender';

export interface Animal {
  id: string;
  profileId: string;
  name: string;
  photoUrl: string;
  petType: PetType;
  years: number;
  months: number;
  gender: Gender;
  breed: number;
  weight: string;
  temperament: string;
  activityLevel: string;
  isTrained: number;
  hasFears: number;
  fearsDescription: string;
  isVaccinated: boolean;
  isCastrated: boolean;
  takesMedications: boolean;
  hasEatingSchedule: boolean;
  otherDietaryNeeds: string;
  healthProblems: string;
}
