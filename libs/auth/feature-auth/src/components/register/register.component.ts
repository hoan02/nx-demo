import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '@nx-demo/auth/data-access';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputErrorsComponent, ListErrorsComponent } from '@nx-demo/core/form';

@Component({
  selector: 'lib-register',
  templateUrl: './register.component.html',
  imports: [
    ListErrorsComponent,
    RouterModule,
    ReactiveFormsModule,
    InputErrorsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    this.authStore.register(this.form.getRawValue());
    this.form.reset();
  }
}
