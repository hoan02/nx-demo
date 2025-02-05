import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Route[] = [
  {
    path: 'categories',
    loadChildren: () =>
      import('categories/Routes').then((m) => m!.categoriesRoutes),
  },
  {
    path: 'users',
    loadChildren: () => import('users/Routes').then((m) => m!.usersRoutes),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('products/Routes').then((m) => m!.productsRoutes),
  },
  {
    path: '',
    component: HomeComponent,
  },
];
