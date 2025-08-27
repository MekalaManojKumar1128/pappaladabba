// src/app/components/shared-cart-view/shared-cart-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedCartService } from '../../services/shared-cart.service';
import { CartItem } from '../../shared/models/cart.model';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationModalComponent } from '../../shared/utils/confirmation-modal/confirmation-modal.component';
import * as LZString from 'lz-string';

@Component({
  selector: 'app-shared-cartview',
  standalone: true,
  imports: [CommonModule, RouterModule,ConfirmationModalComponent],
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
  showConfirmationModal: boolean = false;
  modalTitle: string = ''; // New property for the modal title
  modalMessage: string = ''; // New property for the modal message

  constructor(
    
    private route: ActivatedRoute,
    private sharedCartService: SharedCartService,
    private cartService: CartService,
    private notificationService: NotificationService
  )
  { 
  }

  ngOnInit(): void {
   

    this.route.queryParams.subscribe(params => {
      this.cartId = params['cartData'];
      if (this.cartId) {
        this.loadCartFromUrl();
      } else {
        this.isLoading = false;
        this.cartFound = false;
      }
    });
  }

  private calculateTotals(items: CartItem[]): void {
   // this.cartTotal = items.reduce((total, item) => total + (item.product.basePrice * item.quantity), 0);
    this.cartTotal = items.reduce((total, item) => total + (item.product.basePrice * item.product.selectedUnit.priceFactor * item.product.selectedQuantity), 0)
    this.cartItemCount = items.reduce((count, item) => count + item.product.selectedQuantity, 0);
  }

  loadCartFromUrl(): void {
    
    this.cartTotal = 0;
    this.cartItemCount = 0;
    this.route.queryParams.subscribe(params => {
       // 1. Decompress
       
      const encodedData = params['cartData'];
      if (encodedData) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(encodedData);
          const decodedJson = atob(decompressed);
          this.sharedCartItems = JSON.parse(decodedJson);
          console.log(this.sharedCartItems);
          this.calculateTotals(this.sharedCartItems);
          this.isLoading = false;
          this.cartFound = true;
          this.notificationService.showNotification({
            message: `Cart loaded from shared link.`,
            type: 'info',
            duration: 3000
          });
        } catch (e) {
          console.error('Failed to parse shared cart data from URL:', e);
          this.notificationService.showNotification({
            message: `Invalid shared cart link.`,
            type: 'error',
            duration: 3000
          });
        }
      }
    });
  }
  openConfirmationModal(): void {
    
    this.showConfirmationModal = true;
    this.modalTitle = `Payment `; // Set the title for multi-item deletion
    this.modalMessage = `Did You Received the Payment?`; // Set the message
  }
  confirmAcknowledge(): void {
    this.notificationService.showNotification({
      message: `Thank you for confirmimg!`,
      type: 'success',
      duration: 3000
    });
    this.showConfirmationModal = false;
    
  }
  
  /**
   * Cancels the deletion and hides the confirmation modal.
   */
  cancelAcknowledge(): void {
    this.showConfirmationModal = false;
  }

  
}