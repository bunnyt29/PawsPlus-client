import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

import {PetService} from '../../services/pet.service';
import {SharedModule} from '../../../../shared/shared.module';
import {Gender, GenderTranslations} from '../../../../shared/models/Gender';
import {Pet} from '../../../../shared/models/Pet';
import {Profile} from '../../../../shared/models/Profile';

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink
  ],
  templateUrl: './my-pets.component.html',
  styleUrl: './my-pets.component.scss'
})
export class MyPetsComponent implements OnInit {
  profile!: Profile;
  pets: Array<Pet> = [];

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profile = this.route.snapshot.data['profile'];
    this.fetchData();
  }

  fetchData(): void {
    this.petService.get(this.profile.id).subscribe(res => {
      if (res == null) {
        this.pets = []
      } else {
        this.pets.push(res);
      }
    })
  }

  getGenderTranslation(gender: number): string {
    return GenderTranslations[gender as Gender] || 'Неизвестен';
  }

  navigateToPetDetails(profileId: string) {
    this.router.navigate(['/pet/details', profileId])
  }
}
