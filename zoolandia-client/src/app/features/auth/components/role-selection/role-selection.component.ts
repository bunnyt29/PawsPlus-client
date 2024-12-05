import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Role} from "../../../../shared/models/Roles";

@Component({
  selector: 'role-selection',
  standalone: true,
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss']
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
