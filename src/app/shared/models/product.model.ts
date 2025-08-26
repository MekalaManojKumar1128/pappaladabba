// src/app/shared/models/product.model.ts

export interface ProductUnit {
    label: string; // e.g., '250g', '500g', '1kg'
    priceFactor: number; // e.g., 0.25 for 250g, 0.5 for 500g, 1 for 1kg
  }
  
  export interface Product {
    id: string;
    name: string;
    imageUrls: string[]; // <--- CHANGED: Now an array of image URLs
    description: string;
    basePrice: number;
    units: ProductUnit[];
    category: string;
    selectedUnit: ProductUnit;
    selectedQuantity: number;
  }