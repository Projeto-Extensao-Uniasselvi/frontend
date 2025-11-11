import { Routes } from '@angular/router';

export const PUBLIC_AREA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./publicArea.component').then((c) => c.PublicAreaComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/homePage/homePage.component').then(
            (c) => c.HomePageComponent
          ),
      },
      {
        path: 'articles',
        loadComponent: () =>
          import('./pages/articlesPage/articlesPage.component').then(
            (c) => c.ArticlesPageComponent
          ),
      },
      {
        path: 'articles/:id',
        loadComponent: () =>
          import('./pages/articleView/articleView.component').then(
            (c) => c.ArticleViewComponent
          ),
      },
      {
        path: 'lei-henry-borel',
        loadComponent: () =>
          import('./pages/leiHenryBorel/leiHenryBorel.component').then(
            (c) => c.LeiHenryBorelComponent
          ),
      },
    ],
  },
];