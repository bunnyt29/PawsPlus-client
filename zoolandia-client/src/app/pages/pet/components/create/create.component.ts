import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import {FormArray, FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';

import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { FileService } from '../../../../core/services/file.service';
import {PetService} from '../../services/pet.service';
import {PetType} from '../../../../shared/models/PetType';
import {Gender} from '../../../../shared/models/Gender';
import {ProfileService} from '../../../profile/services/profile.service';
import {ToastrService} from 'ngx-toastr';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {Router} from '@angular/router';
import {AutoCompleteModule} from 'primeng/autocomplete';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [SharedModule, CommonModule, ImageUploadComponent, NavigationMenuComponent, FormsModule, AutoCompleteModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit{
  petForm!: FormGroup;
  selectedPet: string = 'dog';
  currentIndex: number = 0;
  pets: string[] = ['dog', 'cat'];
  dynamicFields: string[] = ['name', 'photoUrl'];
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  Gender = Gender;
  profileId!: string;
  steps = Array(10).fill(0);
  breeds: { id: string; name: string }[] = [];
  items: any[] = [];

  petTranslations: { [key: string]: string } = {
    dog: 'Куче',
    cat: 'Котка'
  };

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private petService: PetService,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private router: Router
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
      breeds: [null, Validators.required],
      weight: ['', Validators.required],
      personality: this.fb.group({
        temperament: [''],
        activityLevel: [''],
        isTrained: [null],
        hasFears: [null],
        fearsDescription: ['Липсват']
      }),
      healthStatus: this.fb.group({
        isVaccinated: [null],
        isCastrated: [null],
        takesMedications: [null],
        hasEatingSchedule: ['Няма'],
        otherDietaryNeeds: ['Няма'],
        healthProblems: ['Няма']
      })
    });
  }

  ngOnInit(): void {
    this.updateFormFields();
    this.setupAgeAdjuster();
    this.getBreeds();
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
    this.getBreeds();
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

  setActivityLevel(level: number) {
    this.petForm.get('personality.activityLevel')?.setValue(level.toString());
  }

  getBreeds() {
    const petType = PetType[this.selectedPet.charAt(0).toUpperCase() + this.selectedPet.slice(1).toLowerCase() as keyof typeof PetType];
    this.petService.getBreeds(petType).subscribe(res => {
      if (Array.isArray(res)) {
        this.breeds = res.map(breed => ({ id: breed.id, name: breed.name }));
        this.items = this.breeds;
      } else {
        console.error('Unexpected response format:', res);
        this.breeds = [];
      }
    }, error => {
      console.error('Error fetching breeds:', error);
    });
  }

  search(event: any) {
    let query = event.query.toLowerCase();
    this.items = this.breeds.filter(breed => breed.name.toLowerCase().includes(query));
  }

  onSubmit(): void {
    this.profileService.getMine().subscribe({
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
            this.router.navigate(['/profile/my-profile-details/my-pets']);
          },
          error: (err) => {
            this.toastr.error("Неуспешно създаване. Опитайте отново.");
          }
        });
      },
      error: (err) => {
        this.toastr.error('Грешка при разпознаване на профила!')
      }
    });
  }

}
