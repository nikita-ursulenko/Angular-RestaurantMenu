import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Импортируем CommonModule
import { FormsModule } from '@angular/forms'; // Импортируем FormsModule для ngModel

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true, // Указываем, что компонент standalone
  imports: [CommonModule, FormsModule], // Добавляем CommonModule и FormsModule
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Метод для входа
  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        console.log('Пользователь вошел');
        this.router.navigate(['/admin']); // Переход к админ-панели после успешного входа
      })
      .catch((error) => {
        this.errorMessage = error.message; // Отображение сообщения об ошибке
        console.error('Ошибка входа:', error);
      });
  }
}