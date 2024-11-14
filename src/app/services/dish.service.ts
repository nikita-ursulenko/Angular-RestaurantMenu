import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Dish } from '../interfaces/dish.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dishesCollection;

  constructor(private firestore: Firestore) {
    this.dishesCollection = collection(this.firestore, 'dishes');
  }

  getDishes(): Observable<Dish[]> {
    return collectionData(this.dishesCollection, { idField: 'id' }) as Observable<Dish[]>;
  }

  addDish(dish: Dish) {
    const dishDoc = doc(this.dishesCollection);
    return setDoc(dishDoc, dish);
  }

  updateDish(id: string, dish: Dish) {
    const dishDoc = doc(this.firestore, `dishes/${id}`);
    return updateDoc(dishDoc, { ...dish });
  }

  deleteDish(id: string) {
    const dishDoc = doc(this.firestore, `dishes/${id}`);
    return deleteDoc(dishDoc);
  }
}