import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
export const appConfig: ApplicationConfig = {
  providers: 
  [
    
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(
      {"projectId":"discountbazar-9786a","appId":"1:235508220703:web:7a29274165f36e4ceda62a","storageBucket":"discountbazar-9786a.firebasestorage.app","apiKey":"AIzaSyBb6RQ_tRL8ch0t-LVjDbmhUbptUoPdU4s","authDomain":"discountbazar-9786a.firebaseapp.com","messagingSenderId":"235508220703","measurementId":"G-65R6SHB60N"
    })), provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), 
  ]
};
