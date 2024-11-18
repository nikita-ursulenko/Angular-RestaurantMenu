import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../../interfaces/dish.interface';
import { FirestoreTestService } from '../../services/firestore-test.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
})
export class AdminPanelComponent implements OnInit {
  dishForm: FormGroup; // Форма для добавления/редактирования блюда
  dishes: Dish[] = []; // Список блюд
  editMode = false; // Режим редактирования
  selectedDishId: string | null = null; // Выбранное блюдо для редактирования
  isModalOpen = false; // Состояние модального окна
  selectedFile: File | null = null; // Выбранный файл для загрузки
  uploadedImageUrl: string | null = null; // URL загруженного изображения
  user: any = null; // Текущий пользователь
  currentSection = 'dishes'; // Текущая секция по умолчанию
  isSidebarOpen = false;
  
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(section: string): void {
    this.currentSection = section;
    this.toggleSidebar(); // Закрываем меню после перехода
  }

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreTestService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService,
    private router: Router
  ) {
    // Инициализация формы блюда
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
    });
  }
  
  ngOnInit() {
    // Подписываемся на поток текущего пользователя
    this.authService.user$.subscribe((user) => {
      this.user = user;
      if (!user) {
        console.warn('Пользователь не авторизован, перенаправление на страницу логина');
        this.router.navigate(['/login']); // Перенаправляем на страницу логина, если пользователь не авторизован
      }
    });

    // Загружаем блюда из Firestore
    this.firestoreService.getDishes((dishes: Dish[]) => {
      this.dishes = dishes.filter(
        (dish) => dish.name && dish.price != null && dish.imageUrl
      );
    });
  }

  // Метод для выхода из аккаунта
  logout() {
    this.authService.logout().then(() => {
      console.log('Пользователь вышел из системы');
      this.router.navigate(['/login']); // Перенаправляем на страницу логина
    });
  }

  // Открытие модального окна для добавления блюда
  openAddDishModal() {
    this.isModalOpen = true;
    this.clearForm();
    this.editMode = false;
  }

  // Закрытие модального окна
  closeAddDishModal() {
    this.isModalOpen = false;
    this.clearForm();
  }

  // Сохранение нового или обновленного блюда
  saveDish() {
    if (this.dishForm.invalid) {
      alert('Форма не заполнена или заполнена некорректно');
      return;
    }

    if (this.uploadedImageUrl) {
      this.dishForm.patchValue({ imageUrl: this.uploadedImageUrl });
    }

    const dishData: Dish = this.dishForm.value;

    if (this.editMode && this.selectedDishId) {
      this.firestoreService.updateDish(this.selectedDishId, dishData)
        .then(() => {
          alert('Блюдо успешно обновлено');
          this.closeAddDishModal();
        })
        .catch((error) => console.error('Ошибка при обновлении блюда:', error));
    } else {
      this.firestoreService.addDish(dishData)
        .then(() => {
          alert('Блюдо успешно добавлено');
          this.closeAddDishModal();
        })
        .catch((error) => console.error('Ошибка при добавлении блюда:', error));
    }
  }

  // Обработка выбранного файла
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.cloudinaryService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          this.uploadedImageUrl = response.secure_url;
          this.dishForm.patchValue({ imageUrl: this.uploadedImageUrl });
        },
        error: (error) => {
          console.error('Ошибка при загрузке изображения:', error);
        },
      });
    }
  }

  // Получение уникальных категорий блюд
  getCategories(): string[] {
    return Array.from(new Set(this.dishes.map((dish) => dish.category)));
  }

  // Получение блюд по категории
  getDishesByCategory(category: string): Dish[] {
    return this.dishes.filter((dish) => dish.category === category);
  }

  // Очистка формы и сброс состояния
  clearForm() {
    this.dishForm.reset();
    this.editMode = false;
    this.selectedDishId = null;
    this.selectedFile = null;
    this.uploadedImageUrl = null;
  }

  // Редактирование существующего блюда
  editDish(dish: Dish) {
    this.editMode = true;
    this.selectedDishId = dish.id!;
    this.dishForm.patchValue(dish);
    this.isModalOpen = true;
  }

  // Удаление блюда
  deleteDish(id: string | undefined) {
    if (id && confirm('Вы уверены, что хотите удалить это блюдо?')) {
      this.firestoreService.deleteDish(id)
        .then(() => alert('Блюдо успешно удалено'))
        .catch((error) => console.error('Ошибка при удалении блюда:', error));
    }
  }
}