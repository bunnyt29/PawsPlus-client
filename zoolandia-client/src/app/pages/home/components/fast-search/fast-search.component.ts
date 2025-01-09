import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-fast-search',
  standalone: true,
  imports: [],
  templateUrl: './fast-search.component.html',
  styleUrl: './fast-search.component.scss'
})
export class FastSearchComponent {
  // fastSearchForm!: FormGroup;
  //
  // public pets: Array<any> = [
  //   {name: 'Dog', value: 1},
  //   {name: "Cat", value: 2}
  // ];
  // constructor(
  //   private fb: FormBuilder
  // ){
  //   this.fastSearchForm = this.fb.group({
  //     pet: new FormArray([]),
  //     service: ['', Validators.required],
  //     startDate: [''],
  //     endDate: [''],
  //     location: ['', Validators.required]
  //   })
  // }
  //
  // onPetChange(event) {
  //   const formArray: FormArray = this.fastSearchForm.get('pets') as FormArray;
  //
  //   if(event.target.checked){
  //     formArray.push(new FormControl(event.target.value));
  //   } else{
  //     let i: number = 0;
  //     formArray.controls.forEach((ctrl: FormControl) => {
  //       if(ctrl.value == event.target.value) {
  //         formArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  // }
}
