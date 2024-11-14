import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../../interfaces/dish.interface';
import { FirestoreTestService } from '../../services/firestore-test.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class AdminPanelComponent implements OnInit {
  dishForm: FormGroup;
  dishes: Dish[] = [];
  editMode = false;
  selectedDishId: string | null = null;
  isModalOpen = false;
  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreTestService,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService
  ) {
    this.dishForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.firestoreService.getDishes((dishes: Dish[]) => {
      this.dishes = dishes.filter(
        (dish) => dish.name && dish.price != null && dish.imageUrl
      );
    });
  }

  openAddDishModal() {
    this.isModalOpen = true;
    this.clearForm();
    this.editMode = false;
  }

  closeAddDishModal() {
    this.isModalOpen = false;
    this.clearForm();
  }

  saveDish() {
    if (this.dishForm.invalid) {
      console.log('Форма не валидна');
      return;
    }

    if (this.uploadedImageUrl) {
      this.dishForm.patchValue({ imageUrl: this.uploadedImageUrl });
    }

    const dishData: Dish = this.dishForm.value;

    if (this.editMode && this.selectedDishId) {
      this.firestoreService.updateDish(this.selectedDishId, dishData);
    } else {
      this.firestoreService.addDish(dishData);
    }
    this.closeAddDishModal();
  }

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

  getCategories(): string[] {
    return Array.from(new Set(this.dishes.map((dish) => dish.category)));
  }

  getDishesByCategory(category: string): Dish[] {
    return this.dishes.filter((dish) => dish.category === category);
  }

  clearForm() {
    this.dishForm.reset();
    this.editMode = false;
    this.selectedDishId = null;
    this.selectedFile = null;
    this.uploadedImageUrl = null;
  }

  editDish(dish: Dish) {
    this.editMode = true;
    this.selectedDishId = dish.id!;
    this.dishForm.patchValue(dish);
    this.isModalOpen = true;
  }

  deleteDish(id: string | undefined) {
    if (id) {
      this.firestoreService.deleteDish(id);
    }
  }
}