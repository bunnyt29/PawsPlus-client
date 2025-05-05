import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

import {PostService} from '../../../post/services/post.service';
import {ModalService} from '../../../../shared/services/modal.service';
import {AuthService} from '../../../auth/services/auth.service';
import {WrapperModalComponent} from '../../../../shared/components/modals/wrapper-modal/wrapper-modal.component';
import {TranslateServicePipe} from '../../../../shared/pipes/translate-service.pipe';
import {AnimalTypePipe} from '../../../../shared/pipes/animal-type.pipe';
import {NotificationService} from '../../../../shared/services/notification.service';
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
    private notificationService: NotificationService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
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

  fetchData(): void {
    this.postService.getPending().subscribe(res => {
      this.pendingPosts = res;
    })
  }

  viewPost(profileId: string): void {
    this.router.navigate(['profile/preview'], { queryParams: { id: profileId }});
  }

  approve(postId: any, profileId: string): void {
    const data = {
      profileId: profileId,
      title: "Профилът ти е одобрен!",
      body: `Всичко изглежда чудесно – профилът ти е активен и можеш да започнеш още днес! `
    }

    this.postService.approve(postId).subscribe(() => {
      this.notificationService.create(data).subscribe(() => {})
      this.toastr.success('Активирахте профила!');
      location.reload();
      this.cd.detectChanges();
    });
  }

  openReasonForRejectModal(postId: string): void {
    this.modalService.open({
      title: `Причина за неодобрение`,
      description: 'Опиши причините за неодобрение по ясен и конструктивен начин, така че получателят да разбере конкретно върху какво трябва да работи и как да подобри представянето си.',
      action: 'disapprovePost',
      data: postId,
      discard: () => this.toastr.info('Изтриването беше отказано'),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
