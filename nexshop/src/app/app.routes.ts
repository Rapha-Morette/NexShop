import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Mfa } from './features/mfa/mfa';
// import { Cadastro } from './pages/cadastro/cadastro';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./features/cadastro/cadastro').then((m) => m.Cadastro),
  },
  { path: 'mfa', component: Mfa },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./features/carrinho/carrinho').then((m) => m.Carrinho),
  },
  {
    path: 'mfa-compra',
    loadComponent: () =>
      import('./features/mfa-compra/mfa-compra').then((m) => m.MfaCompra),
  },
];
