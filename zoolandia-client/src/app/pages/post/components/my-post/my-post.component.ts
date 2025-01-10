import {Component, OnInit} from '@angular/core';
import {Profile} from '../../../../shared/models/Profile';
import {ProfileService} from '../../../profile/services/profile.service';
import {PostService} from '../../services/post.service';
import {Post} from '../../../../shared/models/Post';
import {SharedModule} from '../../../../shared/shared.module';
import {ActivatedRoute} from '@angular/router';
import {ModalService} from 'ngx-modal-ease';

@Component({
  selector: 'app-my-post',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './my-post.component.html',
  styleUrl: './my-post.component.scss'
})
export class MyPostComponent implements OnInit {
  profile!: Profile;
  post!: Post;

  constructor(
    private profileService: ProfileService,
    private postService: PostService,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.profile = this.route.snapshot.data['profile'];
    this.fetchData();
  }

  fetchData() {
    this.postService.get(this.profile.id).subscribe(res => {
      this.post = res;
      console.log(res)
    })
  }
}
