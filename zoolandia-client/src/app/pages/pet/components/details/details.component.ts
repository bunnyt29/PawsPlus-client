import {Component, OnInit} from '@angular/core';
import {PetService} from '../../services/pet.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Pet} from '../../../../shared/models/Pet';
import {Gender, GenderTranslations} from '../../../../shared/models/Gender';
import {NavigationMenuComponent} from '../../../../shared/components/navigation-menu/navigation-menu.component';
import {CommonModule} from '@angular/common';
import {ModalService} from '../../../../shared/services/modal.service';
import {ModalComponent} from '../../../../shared/components/modal/modal.component';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    NavigationMenuComponent,
    RouterLink,
    ModalComponent,
    WrapperModalComponent
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{
  profileId!: string | null;
  pet!: Pet;
  petId!: string;
  activityLevel: number = 0;

  constructor(
    private petService: PetService,
    private modalService: ModalService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.profileId = this.route.snapshot.paramMap.get('id');
    this.fetchData();
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

  openDeleteModal(petId: string) {
    this.modalService.open({
      title: 'Изтрий домашния си любимец',
      description: 'Сигурен ли си, че искаш да изтриеш домашния си любимец?',
      action: 'delete',
      data: petId,
      type: 'deletePet',
      discard: () => console.log('Delete cancelled'),
    });
  }
}
