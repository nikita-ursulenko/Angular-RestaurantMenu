import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideFirebaseApp, initializeApp, getApps } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Не забудьте про аутентификацию
import { routes } from './app.routes';


const firebaseConfig = {
  apiKey: "AIzaSyDz-odHZv0hk-uVDsrVjMVNsgqdXIeytgQ",
  authDomain: "restaurant-menu-angular.firebaseapp.com",
  projectId: "restaurant-menu-angular",
  storageBucket: "restaurant-menu-angular.appspot.com",
  messagingSenderId: "69786866498",
  appId: "1:69786866498:web:dd8e41ab8a81b1ce326edb",
  measurementId: "G-3GR38KGP6H"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideFirebaseApp(() => {
      if (!getApps().length) {
        return initializeApp(firebaseConfig);
      } else {
        return getApps()[0];
      }
    }),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()) // Добавляем провайдер аутентификации
  ]
};