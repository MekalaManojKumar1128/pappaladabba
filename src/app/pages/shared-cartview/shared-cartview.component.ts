// src/app/components/shared-cart-view/shared-cart-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedCartService } from '../../services/shared-cart.service';
import { CartItem } from '../../shared/models/cart.model';

@Component({
  selector: 'app-shared-cartview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shared-cartview.component.html',
  styleUrls: ['./shared-cartview.component.scss']
})
export class SharedCartViewComponent implements OnInit {
  cartId: string | null = null;
  sharedCartItems: CartItem[] = [];
  cartTotal: number = 0;
  cartItemCount: number = 0;
  isLoading: boolean = true;
  cartFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private sharedCartService: SharedCartService
  )
  { 

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.cartId = params.get('cartid');
      if (this.cartId) {
        this.loadSharedCart();
      } else {
        this.isLoading = false;
        this.cartFound = false;
      }
    });
  }

  private loadSharedCart(): void {
    this.isLoading = true;
    this.sharedCartItems = [];
    this.cartTotal = 0;
    this.cartItemCount = 0;
    this.cartFound = false;

    // Simulate fetching data, in a real app this would be an HTTP call to backend
    setTimeout(() => {
      const items = this.sharedCartService.getSharedCart(this.cartId!);
      if (items) {
        this.sharedCartItems = items;
        this.calculateTotals(items);
        this.cartFound = true;
      } else {
        this.cartFound = false;
      }
      this.isLoading = false;
    }, 500); // Simulate network delay
  }

  private calculateTotals(items: CartItem[]): void {
   // this.cartTotal = items.reduce((total, item) => total + (item.product.basePrice * item.quantity), 0);
    this.cartTotal = items.reduce((total, item) => total + (item.product.basePrice * item.product.selectedUnit.priceFactor * item.product.selectedQuantity), 0)
    this.cartItemCount = items.reduce((count, item) => count + item.product.selectedQuantity, 0);
  }
}