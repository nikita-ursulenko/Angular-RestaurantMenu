import { Injectable } from '@angular/core';
import { Firestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, getDocs, QuerySnapshot, where, query } from '@angular/fire/firestore';
import { Dish } from '../interfaces/dish.interface'; // Убедитесь, что интерфейс Dish существует

@Injectable({
  providedIn: 'root',
})
export class FirestoreTestService {
  constructor(private firestore: Firestore) {}

  /**
   * Получение блюд с обновлением в реальном времени.
   * Метод подписывается на изменения в коллекции "dishes".
   * @param callback - Функция, которая вызывается при обновлении данных.
   */
  getDishes(callback: (dishes: Dish[]) => void): void {
    const dishesRef = collection(this.firestore, 'dishes');
    onSnapshot(dishesRef, (snapshot) => {
      const dishes: Dish[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Dish;
        dishes.push({ id: doc.id, ...data });
      });
      callback(dishes);
    });
  }

  /**
   * Добавление нового блюда в коллекцию "dishes".
   * @param dish - Объект блюда для добавления.
   * @returns Promise с результатом операции.
   */
  addDish(dish: Dish): Promise<void> {
    const dishesRef = collection(this.firestore, 'dishes');
    return addDoc(dishesRef, dish)
      .then(() => console.log('Блюдо успешно добавлено'))
      .catch((error) => {
        console.error('Ошибка при добавлении блюда:', error);
        throw error;
      });
  }

  /**
   * Обновление существующего блюда в коллекции "dishes".
   * @param id - Идентификатор блюда.
   * @param dish - Новые данные для блюда.
   * @returns Promise с результатом операции.
   */
  updateDish(id: string, dish: Dish): Promise<void> {
    const dishRef = doc(this.firestore, `dishes/${id}`);
    return setDoc(dishRef, dish)
      .then(() => console.log(`Блюдо ${id} успешно обновлено`))
      .catch((error) => {
        console.error(`Ошибка при обновлении блюда ${id}:`, error);
        throw error;
      });
  }

  /**
   * Удаление блюда из коллекции "dishes".
   * @param id - Идентификатор блюда.
   * @returns Promise с результатом операции.
   */
  deleteDish(id: string): Promise<void> {
    const dishRef = doc(this.firestore, `dishes/${id}`);
    return deleteDoc(dishRef)
      .then(() => console.log(`Блюдо ${id} успешно удалено`))
      .catch((error) => {
        console.error(`Ошибка при удалении блюда ${id}:`, error);
        throw error;
      });
  }

  /**
   * Получение списка пользователей из коллекции "users".
   * @returns Promise со списком пользователей.
   */
  async getUsers(): Promise<{ id: string; email: string }[]> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const querySnapshot: QuerySnapshot = await getDocs(usersRef);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { email: string }),
      }));

      console.log('Пользователи из Firestore:', users);
      return users;
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      throw error;
    }
  }

  /**
   * Получение пользователя по email и паролю.
   * @param email - Email пользователя.
   * @param password - Пароль пользователя.
   * @returns Promise с данными пользователя или null, если пользователь не найден.
   */
  async checkUserInFirestore(email: string, password: string): Promise<{ id: string; email: string } | null> {
    console.log(`Проверка пользователя в Firestore: email = ${email}`);
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email), where('password', '==', password));
      const querySnapshot: QuerySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`Пользователь с email ${email} не найден`);
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as { email: string };

      console.log('Данные пользователя из Firestore:', userData);
      return { id: userDoc.id, email: userData.email };
    } catch (error) {
      console.error('Ошибка при проверке пользователя в Firestore:', error);
      throw error;
    }
  }
}