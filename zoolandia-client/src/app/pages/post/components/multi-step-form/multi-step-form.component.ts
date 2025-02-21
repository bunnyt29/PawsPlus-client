import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {CommonModule} from '@angular/common';
import {PostService} from '../../services/post.service';
import {ToastrService} from 'ngx-toastr';
import {ProfileService} from '../../../profile/services/profile.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.scss'
})
export class MultiStepFormComponent {
  currentStep = 1;
  profileId!: string;

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

  weights = [
    { id: 1, name: 'Малко', value: '0-7 кг.' },
    { id: 2, name: 'Средно', value: '8-20 кг.' },
    { id: 3, name: 'Голямо', value: '21-50 кг.' },
    { id: 4, name: 'Много голямо', value: '50+ кг.' },
  ];

  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private profileService: ProfileService,
    private router: Router,
    private toastr: ToastrService
  )
  {
    this.postForm = this.fb.group({
      profileId: ['', Validators.required],
      services: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      pets: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      weights: this.fb.array([])
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

    formArray.markAsTouched();
    formArray.updateValueAndValidity();
  }

  isSelected(id: number, controlName: string): boolean {
    const formArray = this.postForm.get(controlName) as FormArray;
    return formArray.value.includes(id);
  }

  nextStep() {
    const stepValid = this.validateCurrentStep();
    if (stepValid) {
      const petsValue: number[] = this.postForm.get('pets')?.value || [];
      if (this.currentStep === 1 && !petsValue.includes(1)) {
        this.currentStep = 3;
      } else {
        this.currentStep++;
      }
    } else {
      this.toastr.error("Моля, изберете поне една опция преди да продължите!");
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

  validateCurrentStep(): boolean {
    let controlName = '';
    if (this.currentStep === 1) {
      controlName = 'pets';
    } else if (this.currentStep === 2) {
      controlName = 'weights';
    } else if (this.currentStep === 3) {
      controlName = 'services';
    }

    const formArray = this.postForm.get(controlName) as FormArray;
    return formArray.value.length > 0;
  }

  submitForm() {
    this.profileService.getMine().subscribe(res => {
      this.profileId = res.id;

      this.postForm.patchValue({
        profileId: this.profileId
      });

      if (this.postForm.valid) {
        this.postService.create(this.postForm.value).subscribe(() => {
          this.router.navigate(['/profile/edit']);
        });
      } else {
        this.toastr.error("Моля, попълнете всички необходими полета преди да изпратите формата!");
      }
    })
  }
}
