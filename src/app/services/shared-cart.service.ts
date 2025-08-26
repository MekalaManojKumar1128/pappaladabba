// src/app/services/shared-cart.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // Import PLATFORM_ID and Inject
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
import { CartItem } from '../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class SharedCartService {
  private readonly STORAGE_KEY = 'sharedCarts';
  private isBrowser: boolean; // A flag to check if we are in a browser environment

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { // Inject PLATFORM_ID
    // Set the isBrowser flag based on the platform where the code is running
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Generates a unique ID for the shared cart
  private generateUniqueId(): string {
    // This part doesn't rely on localStorage, so no conditional check needed here
    return Math.random().toString(36).substring(2, 9);
  }

  // Saves a cart for sharing and returns its unique ID
  saveSharedCart(cartItems: CartItem[]): string {
    debugger
    const carts = this.getStoredSharedCarts(); // This calls the method that checks isBrowser
    const id = this.generateUniqueId();
    carts[id] = cartItems;
    this.saveStoredSharedCarts(carts); // This calls the method that checks isBrowser
    return id;
  }

  // Retrieves a shared cart by its ID
  getSharedCart(id: string): CartItem[] | undefined {
    const carts = this.getStoredSharedCarts(); // This calls the method that checks isBrowser
    return carts[id];
  }

  // Deletes a shared cart by its ID
  deleteSharedCart(id: string): void {
    const carts = this.getStoredSharedCarts(); // This calls the method that checks isBrowser
    if (carts[id]) {
      delete carts[id];
      this.saveStoredSharedCarts(carts); // This calls the method that checks isBrowser
    }
  }

  // --- Private methods for localStorage interaction, now with checks ---

  private getStoredSharedCarts(): { [key: string]: CartItem[] } {
    debugger
    // Only access localStorage if running in a browser
    if (this.isBrowser) {
      const cartsJson = localStorage.getItem(this.STORAGE_KEY);
      return cartsJson ? JSON.parse(cartsJson) : {};
    }
    // If not in a browser (e.g., server-side), return an empty object
    return {};
  }

  private saveStoredSharedCarts(carts: { [key: string]: CartItem[] }): void {
    // Only access localStorage if running in a browser
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carts));
    }
  }
}