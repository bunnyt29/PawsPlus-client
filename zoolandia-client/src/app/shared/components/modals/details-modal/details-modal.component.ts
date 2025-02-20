import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarModule} from "primeng/calendar";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostService} from '../../../models/PostService';
import {PostServiceService} from '../../../../pages/post/post-services/services/post-service.service';
import {ModalConfig} from '../../../models/ModalConfig';

@Component({
  selector: 'app-details-modal',
  standalone: true,
    imports: [
      CommonModule,
      CalendarModule,
      ReactiveFormsModule
    ],
  templateUrl: './details-modal.component.html',
  styleUrl: './details-modal.component.scss'
})
export class DetailsModalComponent implements OnInit{
  @Input() config!: ModalConfig;
  @Output() closeModal = new EventEmitter<void>();
  serviceForm!: FormGroup;
  postService!: PostService;
  today!: Date;

  constructor(
    private postServiceService: PostServiceService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.serviceForm = this.fb.group({
      id: ['', Validators.required],
      price: [0, Validators.required],
      availableDates: [[], [Validators.required, Validators.minLength(1)]],
      meetingPlaces: this.fb.array([], Validators.required),
      serviceType: [null, Validators.required],
      postId: ['', Validators.required]
    });
    this.today = new Date();
  }

  ngOnInit() {
    this.getService();
  }

  getService() {
      this.postServiceService.get(this.config.data).subscribe(res => {
        this.postService = res;
        const formattedDates = this.postService.availableDates.map((dateStr: string) => {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day); // Month is 0-based in JS Dates
        });

        // const meetingPlacesArray = this.serviceForm.get('meetingPlaces') as FormArray;
        // meetingPlacesArray.clear();
        // this.postService.meetingPlaces.forEach((place: number) => {
        //   meetingPlacesArray.push(new FormControl(place));
        // });
        //
        this.serviceForm.patchValue({
          price: this.postService.price,
          availableDates: formattedDates,
          serviceType: this.postService.serviceType,
          postId: this.postService.postId
        })
        this.cdr.detectChanges();
      })
  }
}
