import { Product } from './product.model'; // Import the Product interface

export interface CartItem {
  product: Product; // A full Product object is nested here
  quantity: number;
}

export interface Cart {
  items: CartItem[]; // The cart contains an array of CartItem objects
}