import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./adminArea.component').then((c) => c.AdminAreaComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboardPage/dashboardPage.component').then(
            (c) => c.DashboardPageComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/usersPage/usersPage.component').then(
            (c) => c.UsersPageComponent
          ),
      },
      {
        path: 'user/:id',
        loadComponent: () =>
          import('./pages/createEditUserPage/createEditUserPage.component').then(
            (c) => c.CreateEditUserPageComponent
          ),
      },
      {
        path: 'posts',
        loadComponent: () =>
          import('./pages/postsPage/postsPage.component').then(
            (c) => c.PostsPageComponent
          ),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./pages/createEditPostPage/createEditPostPage.component').then(
            (c) => c.CreateEditPostPageComponent
          ),
      },
    ],
  },
];