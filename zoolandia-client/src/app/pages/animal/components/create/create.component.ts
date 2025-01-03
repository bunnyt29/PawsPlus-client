import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { FileService } from '../../../../core/services/file.service';
import {AnimalService} from '../../services/animal.service';
import {PetType} from '../../../../shared/models/PetType';
import {Gender} from '../../../../shared/models/Gender';
import {ProfileService} from '../../../profile/services/profile.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [SharedModule, CommonModule, ImageUploadComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})

export class CreateComponent implements OnInit{
  animalForm: FormGroup;
  selectedAnimal: string = 'dog';
  currentIndex: number = 0;
  animals: string[] = ['dog', 'cat', 'bird', 'other'];
  dynamicFields: string[] = ['name', 'photo'];
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  Gender = Gender;
  profileId!: string;

  animalTranslations: { [key: string]: string } = {
    dog: 'Куче',
    cat: 'Котка',
    bird: 'Птица',
    other: 'Малки животни'
  };

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private animalService: AnimalService,
    private profileService: ProfileService
  ) {
    this.animalForm = this.fb.group({
      profileId: ['', Validators.required],
      name: ['', Validators.required],
      weight: [''],
      photoUrl: [null],
      years: [null],
      months: [null],
      gender: [Gender.Male, Validators.required]
    });
  }

  ngOnInit(): void {
    this.updateFormFields();
  }

  previousAnimal(): void {
    this.currentIndex = (this.currentIndex - 1 + this.animals.length) % this.animals.length;
    this.selectedAnimal = this.animals[this.currentIndex];
    this.updateFormFields();
  }

  nextAnimal(): void {
    this.currentIndex = (this.currentIndex + 1) % this.animals.length;
    this.selectedAnimal = this.animals[this.currentIndex];
    this.updateFormFields();
  }

  updateFormFields(): void {
    const fields: { [key: string]: string[] } = {
      dog: ['name', 'weight', 'photoUrl', 'years', 'months', 'gender'],
      cat: ['name', 'photoUrl', 'years', 'months', 'gender'],
      bird: ['name', 'photoUrl', 'gender'],
      other: ['name', 'photoUrl', 'gender']
    };

    this.dynamicFields = fields[this.selectedAnimal];

    Object.keys(this.animalForm.controls).forEach(control => {
      if (!this.dynamicFields.includes(control)) {
        this.animalForm.removeControl(control);
      }
    });

    this.dynamicFields.forEach(field => {
      if (!this.animalForm.contains(field)) {
        this.animalForm.addControl(
          field,
          this.fb.control(
            '',
            ['name', 'gender'].includes(field) ? Validators.required : null
          )
        );
      }
    });
  }

  onKilogramSelect(value: number): void {
    this.animalForm.patchValue({ weight: value.toString() });
  }

  onFileUpload(file: File): void {
    this.fileService.uploadImage(file).subscribe({
      next: (res) => {
        const photoUrl = res.imageUrl;
        this.animalForm.patchValue({ photoUrl: photoUrl });
      },
      error: (err) => {
        console.error('File upload failed:', err);
      },
    });
  }

  getTranslatedAnimalName(): string {
    return this.animalTranslations[this.selectedAnimal];
  }

  onSubmit(): void {
    this.profileService.getProfile().subscribe(res => {
      this.profileId = res.id;

      if (this.animalForm.valid) {
        const petTypeEnumValue = PetType[this.selectedAnimal.charAt(0).toUpperCase() + this.selectedAnimal.slice(1).toLowerCase() as keyof typeof PetType];

        const formData = {
          ...this.animalForm.value,
          profileId: this.profileId,
          petType: petTypeEnumValue,
          weight: this.animalForm.value.weight?.toString() || '',
          gender: Number(this.animalForm.value.gender),
          breed: 1,
        };

        this.animalService.create(formData).subscribe({
          next: (res) => console.log('Animal created successfully:', res),
          error: (err) => console.error('Error creating animal:', err),
        });
      } else {
        console.error('Invalid form data');
      }
    });
  }

}
