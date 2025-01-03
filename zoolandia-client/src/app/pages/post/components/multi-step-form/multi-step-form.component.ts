import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {PostService} from '../../services/post.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.scss'
})
export class MultiStepFormComponent {
  currentStep = 1;

  services = [
    { id: 1, name: 'Разходка', imagePath: '/images/desktop/post/service-walking.svg' },
    { id: 2, name: 'Дневна грижа', imagePath: '/images/desktop/post/service-daily-care.svg' },
    { id: 3, name: 'Престой', imagePath: '/images/desktop/post/service-pet-boarding.svg' },
    { id: 4, name: 'Тренировки', imagePath: '/images/desktop/post/service-pet-training.svg' },
  ];

  pets = [
    { id: 1, name: 'Куче', imagePath: '/images/shared/dog.svg' },
    { id: 2, name: 'Котка', imagePath: '/images/shared/cat.svg' },
  ];

  sizes = [
    { id: 1, name: 'Малко', value: '0-7 кг.' },
    { id: 2, name: 'Средно', value: '8-20 кг.' },
    { id: 3, name: 'Голямо', value: '21-50 кг.' },
    { id: 4, name: 'Много голямо', value: '50+ кг.' },
  ];

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private toastr: ToastrService
  )
  {
    this.postForm = this.fb.group({
      services: this.fb.array([]),
      pets: this.fb.array([]),
      size: this.fb.array([]),
    });
  }

  onCheckboxChange(event: Event, controlName: string) {
    const checkbox = event.target as HTMLInputElement;
    const formArray = this.postForm.get(controlName) as FormArray;

    if (checkbox.checked) {
      formArray.push(this.fb.control(Number(checkbox.value)));
    } else {
      const index = formArray.value.indexOf(Number(checkbox.value));
      if (index !== -1) {
        formArray.removeAt(index);
      }
    }
  }

  isSelected(id: number, controlName: string): boolean {
    const formArray = this.postForm.get(controlName) as FormArray;
    return formArray.value.includes(id);
  }

  nextStep() {
    const petsValue: number[] = this.postForm.get('pets')?.value || [];
    if (this.currentStep === 1 && !petsValue.includes(1)) {
      this.currentStep = 3;
    } else {
      this.currentStep++;
    }
  }

  previousStep() {
    const petsValue: number[] = this.postForm.get('pets')?.value || [];
    if (this.currentStep === 3 && !petsValue.includes(1)) {
      this.currentStep = 1;
    } else {
      this.currentStep--;
    }
  }

  submitForm() {
    this.postService.create(this.postForm.value).subscribe(res => {
      this.toastr.success("Успешно създаде своя профил!")
    })
  }
}
