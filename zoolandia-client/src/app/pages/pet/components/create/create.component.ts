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
  pets: string[] = ['dog', 'cat', 'bird', 'other'];
  dynamicFields: string[] = ['name', 'photo'];
  defaultImage: string | undefined = '/images/shared/default-image-owner.svg';
  Gender = Gender;
  profileId!: string;

  petTranslations: { [key: string]: string } = {
    dog: 'Куче',
    cat: 'Котка',
    bird: 'Птица',
    other: 'Малки животни'
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
      dog: ['name', 'weight', 'photoUrl', 'years', 'months', 'gender'],
      cat: ['name', 'photoUrl', 'years', 'months', 'gender'],
      bird: ['name', 'photoUrl', 'gender'],
      other: ['name', 'photoUrl', 'gender']
    };

    this.dynamicFields = fields[this.selectedPet];

    Object.keys(this.petForm.controls).forEach(control => {
      if (!this.dynamicFields.includes(control)) {
        this.petForm.removeControl(control);
      }
    });

    this.dynamicFields.forEach(field => {
      if (!this.petForm.contains(field)) {
        this.petForm.addControl(
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
    this.profileService.getProfile().subscribe(res => {
      this.profileId = res.id;

      if (this.petForm.valid) {
        const petTypeEnumValue = PetType[this.selectedPet.charAt(0).toUpperCase() + this.selectedPet.slice(1).toLowerCase() as keyof typeof PetType];

        const formData = {
          ...this.petForm.value,
          profileId: this.profileId,
          petType: petTypeEnumValue,
          weight: this.petForm.value.weight?.toString() || '',
          gender: Number(this.petForm.value.gender),
          breed: 1,
        };

        this.petService.create(formData).subscribe(res => {
          this.toastr.success("Успешно създаде твоя домашен любимец");
        });
      } else {
        console.error('Невалидно попълнени данни.');
      }
    });
  }

}
