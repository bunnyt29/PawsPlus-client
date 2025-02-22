import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {PostService} from '../../../post/services/post.service';
import {TranslateServicePipe} from '../../../../shared/pipes/translate-service.pipe';
import {AnimalTypePipe} from '../../../../shared/pipes/animal-type.pipe';
import {ToastrService} from 'ngx-toastr';
import {ModalService} from '../../../../shared/services/modal.service';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateServicePipe,
    AnimalTypePipe,
    WrapperModalComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild('profileOptions') profileOptionsRef!: ElementRef;
  pendingPosts!: Array<any>;
  optionsVisible: boolean = false;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private eRef: ElementRef
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  toggleOptions(): void {
    if (this.optionsVisible) {
      setTimeout(() => {
        this.optionsVisible = false;
        this.cd.detectChanges();
      }, 200);
    } else {
      this.optionsVisible = true;
      this.cd.detectChanges();
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (
      this.optionsVisible &&
      !this.eRef.nativeElement.contains(target)
    ) {
      this.optionsVisible = false;
      this.cd.detectChanges();
    }
  }

  fetchData() {
    this.postService.getPending().subscribe(res => {
      this.pendingPosts = res;
    })
  }

  viewPost(profileId: string) {
    this.router.navigate(['profile/details'], { queryParams: { id: profileId }});
  }

  approve(postId: any) {
    this.postService.approve(postId).subscribe(res => {
      this.toastr.success('Активирахте профила!')
    });
  }

  openReasonForRejectModal(postId: string) {
    this.modalService.open({
      title: `Причина за неодобрение`,
      description: 'Опиши причините за неодобрение по ясен и конструктивен начин, така че получателят да разбере конкретно върху какво трябва да работи и как да подобри представянето си.',
      action: 'disapprove',
      data: postId,
      discard: () => console.log('Delete cancelled'),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
