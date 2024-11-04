import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,       // Импорт для директивы *ngFor и пайпа currency
    MatToolbarModule,   // Импорт для mat-toolbar
    MatCardModule,      // Импорт для mat-card
    MatButtonModule     // Импорт для кнопок Angular Material
  ]
})
export class CatalogComponent {
  dishes: Dish[] = [
    {
      id: 1,
      name: 'Пицца Маргарита',
      description: 'Классическая пицца с томатами и сыром.',
      price: 300,
      imageUrl: '/assets/pizza.jpg'
    },
    {
      id: 2,
      name: 'Салат Цезарь',
      description: 'Салат с курицей, сыром и соусом Цезарь.',
      price: 200,
      imageUrl: '/assets/caesar.jpg'
    },
    // Добавьте больше блюд при необходимости
  ];

  addToCart(dish: Dish) {
    console.log(`${dish.name} добавлен в корзину!`);
    // Здесь можно добавить логику для добавления блюда в корзину
  }
}