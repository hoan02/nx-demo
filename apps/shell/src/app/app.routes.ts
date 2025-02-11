import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from '@nx-demo/auth/data-access';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@nx-demo/auth/feature-auth').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@nx-demo/auth/feature-auth').then((m) => m.RegisterComponent),
  },
  {
    path: 'lifecycle-hooks',
    loadChildren: () =>
      import('lifecycleHooks/Routes').then((m) => m!.lifecycleHooksRoutes),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('categories/Routes').then((m) => m!.categoriesRoutes),
  },
  {
    path: 'users',
    loadChildren: () => import('users/Routes').then((m) => m!.usersRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('products/Routes').then((m) => m!.productsRoutes),
  },
];
