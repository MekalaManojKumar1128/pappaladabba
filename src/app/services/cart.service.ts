// src/app/services/cart.service.ts
import { Injectable, PLATFORM_ID, Inject } from '@angular/core'; // Import PLATFORM_ID and Inject
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart, CartItem } from '../shared/models/cart.model';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<Cart>;
  public cart$: Observable<Cart>;
  private isBrowser: boolean; // Flag to store the platform status

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID to determine the execution platform
  ) {
    // Determine if the code is running in a browser environment
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Initialize the cart based on whether we are in a browser or not
    const initialCart = this.loadCartFromLocalStorage();
    this.cartSubject = new BehaviorSubject<Cart>(initialCart);
    this.cart$ = this.cartSubject.asObservable();
  }
 // --- ENSURE THIS GETTER IS PRESENT IN YOUR cart.service.ts FILE ---
 get currentCartItems(): CartItem[] {
  
  return this.cartSubject.value.items;
}
  private loadCartFromLocalStorage(): Cart {
    // Only access localStorage if running in a browser
    if (this.isBrowser) {
      const cartJson = localStorage.getItem('cart');
      return cartJson ? JSON.parse(cartJson) : { items: [] };
    }
    // If not in a browser (e.g., server-side), return an empty cart
    return { items: [] };
  }

  private saveCartToLocalStorage(cart: Cart): void {
    // Only access localStorage if running in a browser
    if (this.isBrowser) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    debugger
    const cart = this.cartSubject.value;
    const existingItem = cart.items.find(item =>
      item.product.id === product.id && item.product.selectedUnit.label === product.selectedUnit.label
    );

    if (existingItem) {
      existingItem.product.selectedQuantity += quantity;
    } else {
      cart.items.push({ product: { ...product }, quantity});
    }
    this.updateCart(cart);
  }

  removeFromCart(productId: string, unitLabel: string): void {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(item => !(item.product.id === productId && item.product.selectedUnit.label === unitLabel));
    this.updateCart(cart);
  }

  updateQuantity(productId: string, unitLabel: string, quantity: number): void {
    debugger
    const cart = this.cartSubject.value;
    const item = cart.items.find(i => i.product.id === productId && i.product.selectedUnit.label === unitLabel);
    if (item) {
      item.product.selectedQuantity = quantity;
      if (item.product.selectedQuantity <= 0) {
        this.removeFromCart(productId, unitLabel);
        return;
      }
    }
    this.updateCart(cart);
  }

  clearCart(): void {
    this.updateCart({ items: [] });
  }

  getCartTotal(): Observable<number> {
    return this.cart$.pipe(
      map(cart =>
        cart.items.reduce((total, item) => total + (item.product.basePrice * item.product.selectedUnit.priceFactor * item.product.selectedQuantity), 0)
        
      )
    );
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map(cart => cart.items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  private updateCart(cart: Cart): void {
    this.cartSubject.next(cart);
    this.saveCartToLocalStorage(cart);
  }
}