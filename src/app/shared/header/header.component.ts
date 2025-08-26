import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service'; // Import CartService
import { Observable, Subscription } from 'rxjs'; // Import Observable and Subscription

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy { // Implement OnDestroy
  isMobileMenuOpen: boolean = false;
  cartItemCount$: Observable<number> | undefined; // Observable to hold the cart item count
  private cartSubscription: Subscription | undefined; // To manage subscription lifecycle

  constructor(private cartService: CartService) { } // Inject CartService

  ngOnInit(): void {
    // Get the observable for the cart item count from the CartService
    this.cartItemCount$ = this.cartService.getCartItemCount();

    // Optional: If you need to perform side effects when the count changes,
    // you can subscribe here. Otherwise, using async pipe in template is sufficient.
    // this.cartSubscription = this.cartItemCount$.subscribe(count => {
    //   console.log('Cart items count:', count);
    // });
  }

  ngOnDestroy(): void {
    // Unsubscribe from the cart item count observable to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  /**
   * Toggles the mobile navigation menu open and close.
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}