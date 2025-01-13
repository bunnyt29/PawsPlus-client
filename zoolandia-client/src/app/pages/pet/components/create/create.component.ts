import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { FileService } from '../../../../core/services/file.service';
import {PetService} from '../../services/pet.service';
import {PetType} from '../../../../shared/models/PetType';
import {Gender} from '../../../../shared/models/Gender';
import {ProfileService} from '../../../profile/services/profile.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [SharedModule, CommonModule, ImageUploadComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit{
  petForm: FormGroup;
  selectedPet: string = 'dog';
  currentIndex: number = 0;
  pets: string[] = ['dog', 'cat'];
  dynamicFields: string[] = ['name', 'photoUrl'];
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  Gender = Gender;
  profileId!: string;

  petTranslations: { [key: string]: string } = {
    dog: 'Куче',
    cat: 'Котка'
  };

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private petService: PetService,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {
    this.petForm = this.fb.group({
      profileId: ['', Validators.required],
      name: ['', Validators.required],
      photoUrl: [null],
      petType: [1, Validators.required],
      age: this.fb.group({
        years: [0, Validators.required],
        months: [0, Validators.required]
      }),
      gender: [Gender.Male, Validators.required],
      breed: [1, Validators.required],
      weight: ['', Validators.required],
      personality: this.fb.group({
        temperament: ['', Validators.required],
        activityLevel: ['', Validators.required],
        isTrained: [1, Validators.required],
        hasFears: [1, Validators.required],
        fearsDescription: ['']
      }),
      healthStatus: this.fb.group({
        isVaccinated: [true, Validators.required],
        isCastrated: [true, Validators.required],
        takesMedications: [true, Validators.required],
        hasEatingSchedule: [true, Validators.required],
        otherDietaryNeeds: [''],
        healthProblems: ['']
      })
    });
  }

  ngOnInit(): void {
    this.updateFormFields();
    this.setupAgeAdjuster();
  }

  previousPet(): void {
    this.currentIndex = (this.currentIndex - 1 + this.pets.length) % this.pets.length;
    this.selectedPet = this.pets[this.currentIndex];
    this.updateFormFields();
  }

  nextPet(): void {
    this.currentIndex = (this.currentIndex + 1) % this.pets.length;
    this.selectedPet = this.pets[this.currentIndex];
    this.updateFormFields();
  }

  updateFormFields(): void {
    const fields: { [key: string]: string[] } = {
      dog: ['name', 'photoUrl', 'age', 'gender', 'breed', 'weight', 'personality', 'healthStatus'],
      cat: ['name', 'photoUrl', 'age', 'gender', 'breed', 'personality', 'healthStatus']
    };

    this.dynamicFields = fields[this.selectedPet];
  }

  setupAgeAdjuster(): void {
    const monthsControl = this.petForm.get('age.months');
    const yearsControl = this.petForm.get('age.years');

    if (monthsControl && yearsControl) {
      monthsControl.valueChanges.subscribe((months: number) => {
        if (months >= 12) {
          const additionalYears = Math.floor(months / 12);
          const remainingMonths = months % 12;

          yearsControl.setValue(yearsControl.value + additionalYears);
          monthsControl.setValue(remainingMonths);
        }
      });
    }
  }

  onKilogramSelect(value: number): void {
    this.petForm.patchValue({ weight: value.toString() });
  }

  onFileUpload(file: File): void {
    this.fileService.uploadImage(file).subscribe({
      next: (res) => {
        const photoUrl = res.imageUrl;
        this.petForm.patchValue({ photoUrl: photoUrl });
      },
      error: (err) => {
        console.error('File upload failed:', err);
      },
    });
  }

  getTranslatedPetName(): string {
    return this.petTranslations[this.selectedPet];
  }

  onSubmit(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profileId = res.id;

        const formData = {
          ...this.petForm.value,
          profileId: this.profileId,
          petType: PetType[this.selectedPet.charAt(0).toUpperCase() + this.selectedPet.slice(1).toLowerCase() as keyof typeof PetType],
        };

        this.petService.create(formData).subscribe({
          next: (response) => {
            this.toastr.success("Успешно създаде твоя домашен любимец");
          },
          error: (err) => {
            this.toastr.error("Неуспешно създаване. Опитайте отново.");
          }
        });
      },
      error: (err) => {
        console.error('Грешка при разпознаване на профила.', err);
      }
    });
  }

}
