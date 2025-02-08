import {Component, OnInit} from '@angular/core';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FileService} from '../../../../core/services/file.service';
import {PetService} from '../../services/pet.service';
import {ProfileService} from '../../../profile/services/profile.service';
import {ToastrService} from 'ngx-toastr';
import {PetType} from '../../../../shared/models/PetType';
import {Pet} from '../../../../shared/models/Pet';
import {Gender} from '../../../../shared/models/Gender';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ImageUploadComponent,
    NavigationMenuComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit{
  petForm!: FormGroup;
  pet!: Pet;
  petId!: string;
  selectedPet: string = 'dog';
  currentIndex: number = 0;
  pets: string[] = ['dog', 'cat'];
  dynamicFields: string[] = ['name', 'photoUrl'];
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  Gender = Gender;
  profileId!: string;
  steps = Array(10).fill(0);

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
      id: [''],
      name: ['', Validators.required],
      photoUrl: [null],
      petType: [1, Validators.required],
      age: this.fb.group({
        years: [null, Validators.required],
        months: [null, Validators.required]
      }),
      gender: [Gender.Male, Validators.required],
      breed: ['', Validators.required],
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
        hasEatingSchedule: [''],
        otherDietaryNeeds: ['Няма'],
        healthProblems: ['Няма']
      })
    });
  }

  ngOnInit(): void {
    this.updateFormFields();
    this.setupAgeAdjuster();
    this.fetchData();
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

  setActivityLevel(level: number) {
    this.petForm.get('personality.activityLevel')?.setValue(level.toString());
  }

  fetchData() {
    this.profileService.getMine().subscribe(res => {
      this.profileId = res.id;
      this.petService.get(this.profileId).subscribe(res => {
        this.pet = res;
        this.petId = res.id;
        this.petForm.patchValue({
          id: this.petId,
          name: this.pet.name,
          photoUrl: this.pet.photoUrl,
          petType: this.pet.petType,
          age: {
            years: this.pet.age?.years,
            months: this.pet.age?.months,
          },
          gender: this.pet.gender,
          breed: this.pet.breed,
          weight: this.pet.weight,
          personality: {
            temperament: this.pet.personality?.temperament,
            activityLevel: this.pet.personality?.activityLevel,
            isTrained: this.pet.personality?.isTrained,
            hasFears: this.pet.personality?.hasFears,
            fearsDescription: this.pet.personality?.fearsDescription || 'Липсват',
          },
          healthStatus: {
            isVaccinated: this.pet.healthStatus?.isVaccinated,
            isCastrated: this.pet.healthStatus?.isCastrated,
            takesMedications: this.pet.healthStatus?.takesMedications,
            hasEatingSchedule: this.pet.healthStatus?.hasEatingSchedule,
            otherDietaryNeeds: this.pet.healthStatus?.otherDietaryNeeds || 'Няма',
            healthProblems: this.pet.healthStatus?.healthProblems,
          }
        })
        if (res.petType == 1) {
          this.selectedPet = 'dog';
        } else {
          this.selectedPet = 'cat';
        }
      })
    })
  }
  editPet(): void {
    const formData = {
      ...this.petForm.value,
      petType: PetType[this.selectedPet.charAt(0).toUpperCase() + this.selectedPet.slice(1).toLowerCase() as keyof typeof PetType],
    };

    this.petService.edit(this.petId, formData).subscribe(res => {
      this.toastr.success("Успешно редактира домашния си любимец!");
      this.router.navigate(['/profile/my-profile-details'])
    })
  }
}
