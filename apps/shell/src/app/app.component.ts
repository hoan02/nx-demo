import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthStore } from '@nx-demo/auth/data-access';

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'shell';
  protected readonly authStore = inject(AuthStore);

  constructor() {
    this.authStore.getUser();
  }
}
