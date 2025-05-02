import {Component, OnInit} from '@angular/core';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {Observable} from 'rxjs';
import {LoaderService} from '../../../core/services/loader.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit {
  loading$!: Observable<boolean>;
  constructor(private loaderService: LoaderService) {}
  ngOnInit(): void {
    this.loading$ = this.loaderService.loading$;
  }
}
