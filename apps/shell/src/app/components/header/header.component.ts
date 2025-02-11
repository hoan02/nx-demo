import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IUser } from '@nx-demo/core/api-types';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public readonly user = input.required<IUser>();
  public readonly isLoggedIn = input.required<boolean>();
}
