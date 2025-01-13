import { PetType } from './PetType';
import { Gender } from './Gender';

export interface Pet {
  name: string;
  photoUrl: string;
  petType: PetType;
  age: {
    years: number;
    months: number;
  };
  gender: Gender;
  breed: number;
  weight: string;
  personality?: {
    temperament: string;
    activityLevel: string;
    isTrained: number;
    hasFears: number;
    fearsDescription: string;
  };
  healthStatus?: {
    isVaccinated: boolean;
    isCastrated: boolean;
    takesMedications: boolean;
    hasEatingSchedule: boolean;
    otherDietaryNeeds: string;
    healthProblems: string;
  };
  profileId: string;
}
