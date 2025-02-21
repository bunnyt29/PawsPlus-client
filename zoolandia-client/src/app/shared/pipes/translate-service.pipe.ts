import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateService',
  standalone: true
})
export class TranslateServicePipe implements PipeTransform {

  private translations: { [key: string]: string } = {
    'DogWalking': 'Разхождане на куче',
    'DailyCare': 'Дневна грижа',
    'PetSitting': 'Престой',
    'Training': 'Тренировки'
  };

  transform(value: string): string {
    return this.translations[value] || value;
  }
}
