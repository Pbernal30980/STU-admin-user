import { Route } from '@angular/router';
import { environment } from '../environments/environment';

import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    // Usamos (environment as any) temporalmente para que no marque error si no has agregado authBypass
    redirectTo: (environment as any).authBypass ? 'dashboard/home' : 'login'
  },
  {
    path: 'home-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/home'
  },
  {
    path: 'routes-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/routes'
  },
  {
    path: 'stops-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/stops'
  },
  {
    path: 'users-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/users'
  },
  {
    path: 'assign-driver-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/assign-driver'
  },
  {
    path: 'neighborhoods-page',
    pathMatch: 'full',
    redirectTo: 'dashboard/neighborhoods'
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadComponent: () => import('./administrativePanel/pages/dashboard-page/dashboard-page.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./administrativePanel/pages/home-page/home-page.component')
      },
      {
        path: 'routes',
        loadComponent: () => import('./administrativePanel/pages/routes-page/routes-page.component')
      },
      {
        path: 'stops',
        loadComponent: () => import('./administrativePanel/pages/stops-page/stops-page.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./administrativePanel/pages/users-page/users-page.component')
      },
      {
        path: 'assign-driver',
        loadComponent: () => import('./administrativePanel/pages/assign-driver-page/assign-driver-page.component')
      },
      {
        path: 'neighborhoods',
        loadComponent: () => import('./administrativePanel/pages/neighborhoods-page/neighborhoods-page.component')
      },
      {
        path: '**',
        redirectTo: 'home'
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./administrativePanel/pages/login-page/login-page.component')
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./administrativePanel/pages/reset-password-page/reset-password-page.component')
  },
  {
    path: '**',
    redirectTo: (environment as any).authBypass ? 'dashboard/home' : 'login'
  }
];