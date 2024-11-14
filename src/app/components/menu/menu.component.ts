// src/app/components/menu/menu.component.ts

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  animations: [
    trigger('menuAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MenuComponent {
  @Input() categories: string[] = []; // Список категорий из AppComponent
  @Input() cartItemCount = 0;         // Количество товаров в корзине из AppComponent
  @Output() closeMenu = new EventEmitter<void>();       // Событие для закрытия меню
  @Output() scrollToCategory = new EventEmitter<string>(); // Событие для прокрутки к категории
  
  
  close() {
    this.closeMenu.emit();
  }
  selectCategory(category: string) {
    this.scrollToCategory.emit(category);
    this.close(); // Закрытие меню после выбора категории
  }
}