import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ProfileService} from '../../services/profile.service';
import {FileService} from '../../../../core/services/file.service';
import {AuthService} from '../../../auth/services/auth.service';
import {Router} from '@angular/router';
import {Profile} from '../../../../shared/models/Profile';

@Component({
  selector: 'app-details-mine',
  standalone: true,
  imports: [],
  templateUrl: './details-mine.component.html',
  styleUrl: './details-mine.component.scss'
})
export class DetailsMineComponent{
}
