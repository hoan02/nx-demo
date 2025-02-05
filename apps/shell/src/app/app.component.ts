import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'shell';
}
