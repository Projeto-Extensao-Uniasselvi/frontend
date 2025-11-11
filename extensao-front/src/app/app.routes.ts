import { Routes } from '@angular/router';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./core/publicArea/publicArea.routes').then((m) => m.PUBLIC_AREA_ROUTES),
  },
  {
    path: 'login',
    loadComponent: () =>
    import('./core/adminArea/pages/loginPage/loginPage.component').then(
      (c) => c.LoginPageComponent
    ),
  },
  {
    path: 'esqueci-minha-senha',
    loadComponent: () =>
    import('./core/adminArea/pages/forgotPasswordPage/forgotPasswordPage.component').then(
      (c) => c.ForgotPasswordPageComponent
    ),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
    import('./core/adminArea/pages/resetPasswordPage/resetPasswordPage.component').then(
      (c) => c.ResetPasswordPageComponent
    ),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./core/adminArea/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
