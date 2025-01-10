import {Component, OnInit} from '@angular/core';
import {PetService} from '../../services/pet.service';
import {ActivatedRoute} from '@angular/router';
import {Profile} from '../../../../shared/models/Profile';

@Component({
  selector: 'app-my-pet',
  standalone: true,
  imports: [],
  templateUrl: './my-pet.component.html',
  styleUrl: './my-pet.component.scss'
})
export class MyPetComponent implements OnInit{
  private profile!: Profile;
  constructor(
    private petService: PetService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];
    this.fetchData();
  }

  fetchData(){
    this.petService.get(this.profile.id).subscribe(res => {
      console.log(res);
    })
  }
}
