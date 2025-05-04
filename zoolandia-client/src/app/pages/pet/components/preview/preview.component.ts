import {Component, OnInit} from '@angular/core';
import {Pet} from '../../../../shared/models/Pet';
import {PetService} from '../../services/pet.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gender, GenderTranslations} from '../../../../shared/models/Gender';
import {NgForOf, NgIf} from '@angular/common';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    WrapperModalComponent
  ],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  profileId!: string | null;
  pet!: Pet;
  petId!: string;
  activityLevel: number = 0;

  constructor(
    private petService: PetService,
    private modalService: ModalService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const ownerId = this.route.snapshot.queryParams['ownerId'];
    if (ownerId) {
      this.profileId = ownerId;
      this.fetchData();
    }
  }


  fetchData(){
    this.petService.get(this.profileId).subscribe(res => {
      this.pet = res;
      this.petId = res.id;
      this.activityLevel = Number(this.pet.personality?.activityLevel);
    })
  }

  getGenderTranslation(gender: number): string {
    return GenderTranslations[gender as Gender] || 'Неизвестен';
  }
}
