// src/app/components/product-details/product-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor, CurrencyPipe
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // For route params and navigation
import { CartService } from '../../services/cart.service';
import { Product, ProductUnit } from '../../shared/models/product.model'; // Import Product and ProductUnit
import { Subscription, map } from 'rxjs';
import { DataService } from '../../services/data/dataservice.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedUnit: ProductUnit | undefined;
  quantity: number = 1;
  displayPrice: number = 0;
  allProducts: Product[]  =[];
  // For Image Slideshow
  currentImageIndex: number = 0;
  // For Image Zoom (CSS will handle most of this)
  isZoomed: boolean = false;
  private productsSubscription: Subscription | undefined;

  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
     private dataService: DataService,
     private notificationService: NotificationService
  ) { }

  ngOnInit(): void {

    
    this.productsSubscription = this.dataService.getAllProducts().subscribe(products => {
      this.allProducts = products;
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.product = this.allProducts.find(p => p.id === productId);
        if (this.product) {
          // Select the first unit by default
          if (this.product.units && this.product.units.length > 0) {
            this.selectedUnit = this.product.selectedUnit;
          }
          this.calculateDisplayPrice();
        } else {
          // Product not found, navigate to a 404 page or products list
          this.router.navigate(['/products']);
        }
      } else {
        this.router.navigate(['/products']); // No ID provided, go to products list
      }
    });
  });
   
  }

  /**
   * Calculates the price based on the selected unit and quantity.
   */
  calculateDisplayPrice(): void {
    if (this.product && this.selectedUnit) {
      this.displayPrice = this.product.basePrice * this.selectedUnit.priceFactor * this.quantity;
    } else {
      this.displayPrice = 0;
    }
  }

  /**
   * Handles unit selection change.
   * @param unit The newly selected ProductUnit.
   */
  onUnitChange(unit: ProductUnit): void {
    this.selectedUnit = unit;
    this.calculateDisplayPrice();
  }

  /**
   * Handles quantity change.
   * @param event The input change event.
   */
  onQuantityChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = Number(inputElement.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      this.quantity = newQuantity;
      this.calculateDisplayPrice();
    } else {
      this.quantity = 1; // Default to 1 if invalid input
      this.calculateDisplayPrice();
    }
  }

  /**
   * Adds the selected product with its chosen unit and quantity to the cart.
   */
  addToCart(): void {
    debugger
    let cartItems$ = this.cartService.cart$.pipe(map(cart => cart.items));
    if (this.product && this.selectedUnit && this.quantity > 0) {
      // Create a "cartable" product object that includes the selected unit info
      
      const cartProduct = {
        ...this.product,
        // Override imageUrl with the currently selected image for cart preview if desired,
        // though typically cart only shows one image (e.g., the first one).
        // Using imageUrls[0] for cart consistent with product listing.
        imageUrl: this.product.imageUrls[0],
        name: `${this.product.name} (${this.selectedUnit.label})`, // Modify name for cart display
        price: this.product.basePrice * this.selectedUnit.priceFactor ,// Store the unit-specific price
        selectedUnit :this.selectedUnit
        
      };
      this.cartService.addToCart(cartProduct);
      //this.router.navigate(['/cart']); // Navigate to cart
      this.notificationService.showNotification({
        message: `${this.product.name} added to cart successfully!`,
        type: 'success',
        duration: 500 // Optional: override default duration
      });
    } else {
      alert('Please select a unit and valid quantity.');
    }
  }

  // --- Slideshow Methods ---
  /**
   * Sets the current image to display based on its index.
   * @param index The index of the image to display.
   */
  setCurrentImage(index: number): void {
    if (this.product && this.product.imageUrls && index >= 0 && index < this.product.imageUrls.length) {
      this.currentImageIndex = index;
    }
  }

  /**
   * Shows the next image in the slideshow.
   */
  nextImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.imageUrls.length;
    }
  }

  /**
   * Shows the previous image in the slideshow.
   */
  prevImage(): void {
    if (this.product && this.product.imageUrls) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.imageUrls.length) % this.product.imageUrls.length;
    }
  }

  // --- Image Zoom Methods (for hover effect) ---
  /**
   * Activates zoom on mouse enter.
   */
  onMouseEnterImage(): void {
    this.isZoomed = true;
  }

  /**
   * Deactivates zoom on mouse leave.
   */
  onMouseLeaveImage(): void {
    this.isZoomed = false;
  }

  /**
   * Handles mouse movement for "magnifying glass" effect (optional, more complex)
   * For simple transform:scale zoom, this isn't strictly needed unless you want
   * the zoom origin to follow the mouse. For now, we'll keep it simple.
   */
  onMouseMoveImage(event: MouseEvent): void {
    // If you want a more advanced zoom that follows the mouse,
    // you would calculate mouse position relative to the image
    // and apply a `transform-origin` style here.
    // For a basic scale zoom, this method can be empty or omitted.
  }
}
