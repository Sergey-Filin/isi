import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/components/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden/forbidden.component').then(c => c.ForbiddenComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent)
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full',
  },
];
