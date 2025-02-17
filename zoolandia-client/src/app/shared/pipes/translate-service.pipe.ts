import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateService',
  standalone: true
})
export class TranslateServicePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
