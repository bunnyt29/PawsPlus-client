import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {NgForOf, NgIf} from "@angular/common";
import {PrimeTemplate} from "primeng/api";
import {RatingModule} from "primeng/rating";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {WrapperModalComponent} from "../../../../shared/components/modals/wrapper-modal/wrapper-modal.component";
import {Profile} from '../../../../shared/models/Profile';
import {Review} from '../../../../shared/models/Review';
import {ProfileService} from '../../services/profile.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {environment} from '../../../../../environments/environment';
import {PostService} from '../../../post/services/post.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-owner-details-preview',
  standalone: true,
    imports: [
        GoogleMap,
        MapMarker,
        NgForOf,
        NgIf,
        PrimeTemplate,
        RatingModule,
        RouterLink,
        WrapperModalComponent
    ],
  templateUrl: './owner-details-preview.component.html',
  styleUrl: './owner-details-preview.component.scss'
})
export class OwnerDetailsPreviewComponent {
  profileId!: string;
  data!: any;


  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private postService: PostService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.profileId = params['id'];
    });

    this.fetchData();
  }

  fetchData(): void {
    this.profileService.get(this.profileId).subscribe(res => {
      this.data = res;
    });
  }
}
