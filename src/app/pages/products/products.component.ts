// src/app/components/products/products.component.ts
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product, ProductUnit } from '../../shared/models/product.model';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data/dataservice.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification/notification.service';
import { LoadMoreComponent } from '../../shared/utils/load-more/load-more.component';
import { Category } from '../../shared/models/category.model';

// Define an interface for your category data


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,LoadMoreComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit, OnDestroy {
  // --- Template References ---
  @ViewChild('productsSection') productsSection!: ElementRef<HTMLElement>;
  @ViewChildren('productCard') productCards!: QueryList<ElementRef>;
  
  // --- Constructor + DI ---
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  // --- State / Properties ---
  allProducts: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  displayProducts: Product[] = [];
  selectedCategory: string = 'all';
  isMenuOpen = false;

  // Pagination properties
  visibleCount: number = 4;
  loadStep: number = 4  ;

  private productsSubscription?: Subscription;
  private categoriesSubscription?: Subscription;

  // --- Lifecycle Methods ---
  ngOnInit(): void {
    this.categoriesSubscription = this.dataService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.markForCheck();
    });
    this.allProducts=[];
    this.productsSubscription = this.dataService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      
      // Apply initial filter from query param
      this.route.queryParamMap.subscribe(params => {
        const categoryParam = params.get('category');
        const foundCategory = this.categories.find(cat => cat.value === categoryParam);
        this.filterProductsByCategory(foundCategory ? foundCategory.value : 'all');
        this.cdr.markForCheck();
      });
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
  }

  // --- Category Methods ---
  filterProductsByCategory(category: string): void {
    this.visibleCount = this.loadStep;
    this.selectedCategory = category;

    if (this.selectedCategory === 'all') {
      this.filteredProducts = this.allProducts.map(product => ({
        ...product,
        selectedQuantity: product.selectedQuantity || 1,
        selectedUnit: product.selectedUnit || product.units[0]
      }));
    } else {
      
      this.filteredProducts = this.allProducts
        .filter(product => product.category === this.selectedCategory)
        .map(product => ({
          ...product,
          selectedQuantity: product.selectedQuantity || 1,
          selectedUnit: product.selectedUnit || product.units[0]
        }));
    }

    this.updateDisplayProducts();
    this.scrollToProducts();
    this.isMenuOpen = false;
    this.cdr.markForCheck();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getSelectedCategoryName(): string {
    const selected = this.categories.find(cat => cat.value === this.selectedCategory);
    return selected ? selected.name : '';
  }

  // --- Cart Methods ---
  addToCart(product: Product): void {
    const quantity = product.selectedQuantity || 1;
    this.cartService.addToCart(product, quantity);
    this.notificationService.showNotification({
      message: `${product.name} added to cart successfully!`,
      type: 'success',
      duration: 500
    });
  }

  // --- Product Unit / Quantity Methods --
  onUnitChange(product: Product, selectedLabel: string): void {
    const selectedUnit = product.units.find(unit => unit.label === selectedLabel);
    if (selectedUnit) {
      product.selectedUnit = { ...selectedUnit };
      this.cdr.markForCheck();
    }
  }

  incrementQuantity(product: Product): void {
    product.selectedQuantity = (product.selectedQuantity || 0) + 1;
    this.cdr.markForCheck();
  }

  decrementQuantity(product: Product): void {
    if (product.selectedQuantity && product.selectedQuantity > 1) {
      product.selectedQuantity -= 1;
      this.cdr.markForCheck();
    }
  }

  onQuantityInputChange(product: Product, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let quantity = parseInt(inputElement.value, 10);
    if (isNaN(quantity) || quantity < 1) {
      this.notificationService.showNotification({
        message: 'Minimum quantity is 1',
        type: 'error',
        duration: 3000
      });
      inputElement.value = product.selectedQuantity?.toString() ?? '1';
      return;
    }
    product.selectedQuantity = quantity;
    this.cdr.markForCheck();
  }

  // --- Pagination / Utility ---
  loadMore(): void {
    const prevCount = this.visibleCount;
    this.visibleCount += this.loadStep;
    this.updateDisplayProducts();
    
    setTimeout(() => {
      const newCard = this.productCards.toArray()[prevCount];
      if (newCard) {
        newCard.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.cdr.markForCheck();
    }, 100);
  }

  private updateDisplayProducts(): void {
    this.displayProducts = this.filteredProducts.slice(0, this.visibleCount);
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
  
  private scrollToProducts(): void {
    if (this.productsSection) {
      setTimeout(() => {
        this.productsSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }
}