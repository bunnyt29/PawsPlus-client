import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'animalType',
  standalone: true
})
export class AnimalTypePipe implements PipeTransform {

  private translations: { [key: string]: string } = {
    'Dog': 'Куче',
    'Cat': 'Котка',
  };

  transform(value: string): string {
    return this.translations[value] || value;
  }

}
