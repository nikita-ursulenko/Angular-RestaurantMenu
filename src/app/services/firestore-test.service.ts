import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { Dish } from '../interfaces/dish.interface';

@Injectable({
  providedIn: 'root'
})
export class FirestoreTestService {
  constructor(private firestore: Firestore) {}

  // Получение блюд с обновлением в реальном времени
  getDishes(callback: (dishes: Dish[]) => void) {
    const dishesRef = collection(this.firestore, 'dishes');
    onSnapshot(dishesRef, (snapshot) => {
      const dishes: Dish[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as Dish;
        dishes.push({ id: doc.id, ...data });
      });
      callback(dishes);
    });
  }

  // Метод для добавления блюда
  addDish(dish: Dish) {
    const dishesRef = collection(this.firestore, 'dishes');
    return addDoc(dishesRef, dish);
  }

  // Метод для обновления блюда
  updateDish(id: string, dish: Dish) {
    const dishRef = doc(this.firestore, `dishes/${id}`);
    return setDoc(dishRef, dish);
  }

  // Метод для удаления блюда
  deleteDish(id: string) {
    const dishRef = doc(this.firestore, `dishes/${id}`);
    return deleteDoc(dishRef);
  }
}