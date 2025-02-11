import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@nx-demo/auth/data-access';
import { InputErrorsComponent, ListErrorsComponent } from '@nx-demo/core/form';

@Component({
  selector: 'lib-login',
  templateUrl: './login.component.html',
  imports: [
    ListErrorsComponent,
    RouterLink,
    ReactiveFormsModule,
    InputErrorsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.authStore.login(this.form.getRawValue());
    this.form.reset();
  }
}
