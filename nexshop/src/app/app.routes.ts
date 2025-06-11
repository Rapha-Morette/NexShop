import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Cadastro } from './pages/cadastro/cadastro';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then(
        (m) => m.Cadastro
      ),
  },
];
