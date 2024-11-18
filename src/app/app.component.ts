import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { FirestoreTestService } from './services/firestore-test.service'; 
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MenuComponent,
    FormsModule, // Добавляем FormsModule для ngModel
    ReactiveFormsModule, // Для работы с реактивными формами

  ]
})
export class AppComponent implements OnInit {
  title = 'restaurant-menu';
  cartItemCount = 3;
  menuVisible = false;
  categories: string[] = [];

  constructor(private router: Router, private firestoreTestService: FirestoreTestService) {
    
  }
  
  isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit() {
    console.log('AppComponent загружен'); // Проверка, что компонент загружен корректно
    // Логика инициализации
  }
  

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    console.log('Меню видимо:', this.menuVisible); // Отслеживаем состояние меню
  }

  updateCategories(categories: string[]) {
    this.categories = categories;
    console.log('Категории обновлены:', this.categories); // Проверка обновления категорий
  }

  scrollToCategory(category: string) {
    console.log('Прокрутка к категории:', category); // Отслеживаем вызов прокрутки
    const element = document.getElementById(category);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.menuVisible = false;
      console.log('Категория найдена и прокрутка выполнена'); // Убедитесь, что элемент существует и прокрутка происходит
    } else {
      console.log('Категория не найдена'); // Сообщение, если элемент не найден
    }
  }
}