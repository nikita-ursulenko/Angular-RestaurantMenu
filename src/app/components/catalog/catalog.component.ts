import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router'; 
import { PipesModule } from '../../pipes/pipes.module'; 

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

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
    MatToolbarModule,
    PipesModule
  ]
})
export class CatalogComponent implements OnInit {
  dishes: Dish[] = [
    { id: 1, name: 'Пицца Маргарита', description: 'Классическая пицца с томатами и сыром.', price: 300, imageUrl: '/assets/pizza_margarita.jpg', category: 'Пицца' },
    { id: 2, name: 'Салат Цезарь', description: 'Салат с курицей, сыром и соусом Цезарь.', price: 200, imageUrl: '/assets/salat_caesar.jpg', category: 'Салат' },
    { id: 3, name: 'Пицца Ранчо', description: 'Классическая пицца с томатами и сыром.', price: 100, imageUrl: '/assets/pizza_rancho.jpg', category: 'Пицца' },
    { id: 4, name: 'Пицца Фатто', description: 'Пицца с курицей и сыром.', price: 200, imageUrl: '/assets/pizza_fatto.jpg', category: 'Пицца' },
    { id: 5, name: 'Горячее Блюдо', description: 'Горячее мясное блюдо.', price: 250, imageUrl: '/assets/hot_dish.jpg', category: 'Горячее' },
    { id: 6, name: 'Напиток Кола', description: 'Газированный напиток.', price: 50, imageUrl: '/assets/drink_cola.jpg', category: 'Напитки' },
  ];

  @Output() categoriesEvent = new EventEmitter<string[]>();

  ngOnInit() {
    this.sendUniqueCategories();
  }

  getUniqueCategories(): string[] {
    return Array.from(new Set(this.dishes.map(dish => dish.category)));
  }

  sendUniqueCategories() {
    const uniqueCategories = Array.from(new Set(this.dishes.map(dish => dish.category)));
    this.categoriesEvent.emit(uniqueCategories);
  }

  addToCart(dish: Dish) {
    console.log(`${dish.name} добавлен в корзину!`);
  }
}