// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { LoginComponent } from './components/login/login.component';


export const routes: Routes = [
  { path: '', component: CatalogComponent },        // Главная страница (каталог)
  { path: 'cart', component: CartComponent },       // Страница корзины
  { path: 'admin', component: AdminPanelComponent }, // Админ-панель
  { path: 'login', component: LoginComponent },      // Авторизация

  { path: '**', redirectTo: '' }                     // Перенаправление на каталог при неизвестном пути
];