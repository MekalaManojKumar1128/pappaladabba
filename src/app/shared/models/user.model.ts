// src/app/shared/models/user.model.ts

export interface User {
    uid: string; // Firebase User ID
    email: string;
    username?: string; // Optional, as it might be stored in Firestore rather than directly on FirebaseAuth User
    // Add other user properties you might store in Firestore, e.g.,
    // firstName?: string;
    // lastName?: string;
    // role?: string; // 'admin' | 'customer'
  }
  
  // We don't need a custom AuthResponse interface for Firebase Auth directly.
  // The auth service will return Firebase's UserCredential or User objects.