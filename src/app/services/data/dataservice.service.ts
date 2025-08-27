// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Product } from '../../shared/models/product.model';
import { Category } from '../../shared/models/category.model';


// Define interfaces for the structure of your JSON data
interface AppData {
  products: Product[];
  categories: Category[]; // imageUrl is optional for 'All Products'
  featuredProducts: { id: string; name: string; price: number; imageUrl: string }[];
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data/app-data.json'; // Path to your JSON file
  private allProductsSubject = new BehaviorSubject<Product[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private featuredProductsSubject = new BehaviorSubject<any[]>([]); // Using 'any' for featuredProducts for now

  constructor(private http: HttpClient) {
    this.loadData(); // Load data when the service is initialized
  }

  private loadData(): void {
    this.http.get<AppData>(this.dataUrl).pipe(
      tap(data => {
        // Initialize products with a default selectedUnit and selectedQuantity
        const productsWithDefaults = data.products.map(product => ({
          ...product,
          selectedUnit: product.units && product.units.length > 0 ? product.units[0] : { label: 'Default', priceFactor: 1 },
          selectedQuantity: 1
        }));
        this.allProductsSubject.next(productsWithDefaults);
        this.categoriesSubject.next(data.categories);
        this.featuredProductsSubject.next(data.featuredProducts);
      }),
      catchError(error => {
        console.error('Error loading app data:', error);
        // Provide default empty arrays in case of an error
        this.allProductsSubject.next([]);
        this.categoriesSubject.next([]);
        this.featuredProductsSubject.next([]);
        return []; // Return an empty observable to complete the stream
      })
    ).subscribe();
  }

  /**
   * Returns an Observable of all products.
   * @returns Observable<Product[]>
   */
  getAllProducts(): Observable<Product[]> {
    return this.allProductsSubject.asObservable();
  }

  /**
   * Returns an Observable of all categories.
   * @returns Observable<Category[]>
   */
  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  /**
   * Returns an Observable of featured products.
   * @returns Observable<any[]>
   */
  getFeaturedProducts(): Observable<any[]> {
    return this.featuredProductsSubject.asObservable();
  }

  /**
   * Returns a single product by ID.
   * @param id The ID of the product to retrieve.
   * @returns Observable<Product | undefined>
   */
  getProductById(id: string): Observable<Product | undefined> {
    return this.allProductsSubject.pipe(
      map(products => products.find(p => p.id === id))
    );
  }
}
