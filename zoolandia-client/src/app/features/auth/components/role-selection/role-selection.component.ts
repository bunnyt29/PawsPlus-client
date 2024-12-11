import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {Role} from '../../../../shared/models/Roles';
import {SharedModule} from '../../../../shared/shared.module';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [SharedModule, NgOptimizedImage],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss'
})
export class RoleSelectionComponent {
  constructor(
    private router: Router
  )
  { }
  chooseRole(roleAsString: string) {
    if(roleAsString=="owner") {
      const role = Role.Owner
      this.router.navigate(['/features/auth/register'], { queryParams: { role } });
    } else {
      const role = Role.Sitter
      this.router.navigate(['/features/auth/register'], { queryParams: { role } });
    }
  }
}
