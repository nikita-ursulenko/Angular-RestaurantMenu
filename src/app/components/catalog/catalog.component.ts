import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module'; 
import { FirestoreTestService } from '../../services/firestore-test.service';  // Импортируем сервис для работы с Firestore
import { Dish } from '../../interfaces/dish.interface'; // Импортируем интерфейс для блюд

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    PipesModule
  ]
})
export class CatalogComponent implements OnInit {
  dishes: Dish[] = []; // Массив для хранения всех блюд
  categories: string[] = []; // Массив для хранения категорий

  @Output() categoriesEvent = new EventEmitter<string[]>();

  constructor(private firestoreService: FirestoreTestService) {}

  ngOnInit() {
    // Загружаем блюда из Firebase при инициализации компонента
    this.firestoreService.getDishes((dishes: Dish[]) => {
      this.dishes = dishes;
      this.sendUniqueCategories();  // Отправляем уникальные категории
    });
  }

  // Получаем уникальные категории
  getUniqueCategories(): string[] {
    return Array.from(new Set(this.dishes
      .map(dish => dish.category)  // Извлекаем категории из блюд
      .filter(category => category)) // Фильтруем пустые значения
    );
  }

  // Отправляем уникальные категории родительскому компоненту
  sendUniqueCategories() {
    this.categories = this.getUniqueCategories();
    this.categoriesEvent.emit(this.categories);
  }

  // Добавление блюда в корзину
  addToCart(dish: Dish) {
    console.log(`${dish.name} добавлен в корзину!`);
  }
}