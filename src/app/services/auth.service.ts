import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { FirestoreTestService } from './firestore-test.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(); // Инициализация Firebase Auth
  private userSubject = new BehaviorSubject<User | null>(null); // Поток для текущего пользователя
  user$ = this.userSubject.asObservable(); // Доступ к потоку через Observable

  private readonly AUTH_STORAGE_KEY = 'auth_state'; // Ключ для хранения состояния в localStorage
  private authTimeout: any; // Таймер для автоматического выхода

  constructor(private firestoreTestService: FirestoreTestService, private router: Router) {
    console.log('AuthService инициализирован');

    // Восстанавливаем состояние из localStorage при загрузке
    const savedState = localStorage.getItem(this.AUTH_STORAGE_KEY);
    if (savedState) {
      const authData = JSON.parse(savedState);
      if (authData && authData.expiration > Date.now()) {
        this.restoreAuthState(authData.user);
      } else {
        this.clearAuthState();
      }
    }

    // Подписываемся на изменения состояния пользователя
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('onAuthStateChanged: Пользователь авторизован', user);
        this.setAuthState(user, 5 * 60 * 1000); // Устанавливаем состояние авторизации на 5 минут
      } else {
        console.log('onAuthStateChanged: Пользователь не авторизован');
        this.clearAuthState();
      }
    });
  }

  /**
   * Логин пользователя.
   * Проверяет пользователя в Firestore.
   * @param email Email пользователя.
   * @param password Пароль пользователя.
   * @returns Promise с данными пользователя или ошибкой.
   */
  login(email: string, password: string): Promise<User | null> {
    console.log(`Попытка логина для email: ${email}`);

    return this.firestoreTestService.checkUserInFirestore(email, password).then((user) => {
      if (user) {
        console.log(`Пользователь найден в Firestore: ${email}`);
        const userData = {
          uid: user.id,
          email: user.email,
          displayName: user.email,
        } as User;

        this.setAuthState(userData, 5 * 60 * 1000); // Устанавливаем состояние авторизации на 5 минут
        this.router.navigate(['/admin']);
        return userData;
      } else {
        console.error(`Ошибка: Пользователь с email ${email} не найден в Firestore`);
        throw new Error('Неверный логин или пароль');
      }
    }).catch((error) => {
      console.error('Ошибка при логине:', error.message);
      throw error;
    });
  }

  /**
   * Выход пользователя.
   * @returns Promise завершения выхода.
   */
  logout(): Promise<void> {
    console.log('Пользователь выходит из системы');
    this.clearAuthState();
    return this.auth.signOut();
  }

  /**
   * Проверка роли пользователя.
   * @param user Пользователь из Firebase Auth.
   * @returns true, если пользователь является администратором.
   */
  isAdmin(user: User | null): boolean {
    if (!user) {
      console.warn('Проверка администратора: Пользователь не авторизован');
      return false;
    }

    const isAdmin = user.email === 'admin@example.com';
    console.log(`Проверка роли администратора для ${user.email}: ${isAdmin}`);
    return isAdmin;
  }

  /**
   * Устанавливает состояние авторизации на заданное время.
   * @param user Данные пользователя.
   * @param duration Продолжительность авторизации в миллисекундах.
   */
  private setAuthState(user: User, duration: number): void {
    console.log('Устанавливаем состояние авторизации:', user);
    const expiration = Date.now() + duration;

    // Сохраняем данные в localStorage
    localStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify({ user, expiration }));

    // Обновляем поток состояния
    this.userSubject.next(user);

    // Устанавливаем таймер для автоматического выхода
    this.authTimeout = setTimeout(() => {
      console.log('Время авторизации истекло');
      this.logout();
    }, duration);
  }

  /**
   * Восстанавливает состояние авторизации.
   * @param user Данные пользователя.
   */
  private restoreAuthState(user: User): void {
    console.log('Восстанавливаем состояние авторизации из localStorage:', user);
    this.userSubject.next(user);
  }

  /**
   * Очищает состояние авторизации.
   */
  private clearAuthState(): void {
    console.log('Очищаем состояние авторизации');
    localStorage.removeItem(this.AUTH_STORAGE_KEY);
    this.userSubject.next(null);

    if (this.authTimeout) {
      clearTimeout(this.authTimeout);
      this.authTimeout = null;
    }
  }

  /**
   * Проверяет, авторизован ли пользователь.
   * @returns true, если пользователь авторизован.
   */
  isAuthenticated(): boolean {
    const user = this.userSubject.getValue();
    return user !== null;
  }

  /**
   * Получение текущего пользователя.
   * @returns Объект пользователя из потока или null.
   */
  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }
}