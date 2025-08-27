// src/app/components/cart/cart.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../shared/models/cart.model'; // Ensure CartItem is correctly defined here
import { Observable } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { SharedCartService } from '../../services/shared-cart.service';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmationModalComponent } from '../../shared/utils/confirmation-modal/confirmation-modal.component';
import * as LZString from 'lz-string';

// REMOVE this import as 'uuid' is not used here for ID generation.
// If you still have it, please delete this line:
// import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule,ConfirmationModalComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  cartItemCount$: Observable<number>;

  sharedCartUrl: string = '';
  showSharedUrl: boolean = false;
  whatsappPhoneNumber: string = '919963635344'; // <--- REPLACE WITH YOUR DESIRED NUMBER
  selectedItems = new Set<string>();
    // New property to control confirmation modal visibility
    showConfirmationModal: boolean = false;
      // New property to store the single item to be removed
  itemToRemove: { productId: string, unitLabel: string } | null = null;
  modalTitle: string = ''; // New property for the modal title
  modalMessage: string = ''; // New property for the modal message
 
  constructor(
    private cartService: CartService,
    private router: Router,
    private sharedCartService: SharedCartService,
    private notificationService: NotificationService
  ) {
    // This line uses map(cart => cart.items), implying cartService.cart$ emits an object
    // that has an 'items' property. This is correctly preserved.
    this.cartItems$ = this.cartService.cart$.pipe(map(cart => cart.items));
    this.cartTotal$ = this.cartService.getCartTotal();
    this.cartItemCount$ = this.cartService.getCartItemCount();
  }

  ngOnInit(): void {}
/**
   * Generates a unique key for each cart item based on its product ID and unit label.
   * @param item The CartItem object.
   * @returns A unique string key.
   */
getUniqueItemKey(item: CartItem): string {
  return `${item.product.id}_${item.product.selectedUnit.label}`;
}

  /**
   * Toggles the selection state of a cart item.
   * @param itemKey The unique key of the item to select/deselect.
   */
  toggleSelection(itemKey: string): void {
    if (this.selectedItems.has(itemKey)) {
      this.selectedItems.delete(itemKey);
    } else {
      this.selectedItems.add(itemKey);
    }
  }
  onQuantityInputChange(item: CartItem, event: Event): void {
    debugger
    const selectElement = event.target as HTMLSelectElement;
    const quantity = parseInt(selectElement.value, 10);
    if (quantity < 1) {
      
      this.notificationService.showNotification({
        message: `minimum quantity is 1`,
        type: 'error',
        duration: 3000 // Optional: override default duration
      });
      selectElement.value=item.product.selectedQuantity.toString();
      return; // Ignore invalid quantities
    }
    this.cartService.updateQuantity(item.product.id, item.product.selectedUnit.label, quantity);
  }

  updateItemQuantity(item: CartItem, newQuantity: number): void {
    // REMOVE or comment out the `debugger` line in production.
    debugger
    // Ensure newQuantity is a valid number and at least 1 (as 0 typically means removal)
    if (newQuantity < 1) {
      debugger
      this.notificationService.showNotification({
        message: `quantity atleast 1`,
        type: 'error',
        duration: 3000 // Optional: override default duration
      });
      return; // Ignore invalid quantities
    }
    const quantity = Math.max(1, newQuantity); // Corrected to enforce minimum quantity of 1
    this.cartService.updateQuantity(item.product.id, item.product.selectedUnit.label, quantity);
  }

  removeItem(productId: string, unitLabel: string): void {
    this.cartService.removeFromCart(productId, unitLabel);
    this.notificationService.showNotification({
      message: `selected item removed from cart successfully!`,
      type: 'error',
      duration: 3000 // Optional: override default duration
    });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.sharedCartUrl = '';
    this.showSharedUrl = false;
  }

  checkout(): void {
    this.router.navigate(['/payment']);
  }

  // Handles copying the URL to clipboard when the input is clicked
  copySharedUrl(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      inputElement.select(); // Select the text in the input field

      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.sharedCartUrl).then(() => {
          console.log('Shared URL copied to clipboard automatically on click.');
          // Optional: You might want to show a small toast notification here to confirm to the user
        }).catch(err => {
          console.error('Failed to auto-copy URL:', err);
          alert('Failed to automatically copy the URL. Please copy it manually from the field.');
        });
      } else {
        // Fallback for older browsers that don't support navigator.clipboard
        alert('Your browser does not support automatic clipboard access. Please manually copy the URL from the field.');
      }
    }
  }

  // Generates and displays the persistent cart link
  shareCart(): void {
    this.generatePermalink();
    // CORRECTED: Use this.cartService.currentCartItems as it's a direct synchronous property
    const currentItems = this.cartService.currentCartItems;
    if (currentItems.length === 0) {
      alert('Your cart is empty. Add products before generating a shareable link!');
      return;
    }

    const sharedId = this.sharedCartService.saveSharedCart(currentItems);
    // this.sharedCartUrl = `${window.location.origin}/shared-cart/${sharedId}`;
    // this.showSharedUrl = true;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.sharedCartUrl).then(() => {
        alert('Your cart link has been generated and copied to clipboard!');
        console.log('Cart URL copied to clipboard:', this.sharedCartUrl);
      }).catch(err => {
        console.error('Could not copy text: ', err);
        alert('Your cart link has been generated. Please copy it manually from the field.');
      });
    } else {
      alert('Your cart link has been generated. Please copy it manually from the field.');
    }
  }

  // REVISED: Shares the order details with a persistent link via WhatsApp
  shareViaWhatsApp(): void {
    
    // 1. Ensure the shared cart URL is generated first
    if (!this.sharedCartUrl) {
      // If the link hasn't been generated, generate it.
      // This will call shareCart(), which handles updating this.sharedCartUrl and showing alerts.
      this.shareCart();

      // IMPORTANT: Since shareCart() involves UI updates and potentially async operations
      // (though in your setup it seems largely synchronous), there's a tiny chance
      // this.sharedCartUrl might not be immediately available right after `this.shareCart()`.
      // For a truly robust solution with an async `shareCart` (e.g., if it made an HTTP request),
      // you would typically chain promises or use async/await.
      // For now, we'll re-check and alert if it's still missing.
      if (!this.sharedCartUrl) {
        alert('Failed to generate cart link. Please ensure your cart is not empty and try again.');
        return;
      }
    }

    // 2. Get current cart items and calculate total/count
    // CORRECTED: Use this.cartService.currentCartItems for the synchronous array of items.
    const currentItems = this.cartService.currentCartItems;

    if (currentItems.length === 0) {
      alert('Your cart is empty. Add products before sharing!');
      return;
    }

    // CORRECTED: Calculate total and itemCount from currentItems directly.
    // This avoids assuming properties on cartService.cart$.value and uses the definitive item data.
    const currentTotal = currentItems.reduce((total, item) => {
      return total + (item.product.basePrice * item.product.selectedUnit.priceFactor * item.product.selectedQuantity);
    }, 0);
    const currentItemCount = currentItems.reduce((count, item) => count + item.product.selectedQuantity, 0);

    // Use the sharedId from the URL as the "Cart ID" for the message
    const orderId = this.sharedCartUrl.split('/').pop() || 'N/A'; // Extracts the ID from the generated URL

    let message = `*🛒 Your Cart Details 🛒*\n\n`; // Bold heading for WhatsApp
    message += `*Items:*\n`; // Bold subheading

    currentItems.forEach((item, index) => {
      const itemPrice = item.product.basePrice * item.product.selectedUnit.priceFactor;
      const itemTotal = itemPrice * item.product.selectedQuantity; // Use item.quantity from CartItem
      message += `${index + 1}. ${item.product.name} (${item.product.selectedUnit.label}) x ${item.product.selectedQuantity} = *₹${itemTotal.toFixed(2)}*\n`; // Bold item total
    });

    message += `\n--------------------------\n`;
    message += `*📦 Total Items:* ${currentItemCount}\n`; // Bold total items
    message += `*💰 Grand Total:* *₹${currentTotal.toFixed(2)}*\n`; // Bold grand total
    message += `*🚚 Shipping:* T&C\n`; // Assuming shipping is always free
    message += `--------------------------\n\n`;
    message += `Click here to view your cart:\n${this.sharedCartUrl}\n\n`; // Include the persistent link
    message += `Thank you for your interest! 😊`;

    const encodedMessage = encodeURIComponent(message);

    // Optional: Add a check if the number is configured
    if (!this.whatsappPhoneNumber) {
      alert('WhatsApp contact number is not configured. Please set it in the component.');
      return;
    }

    // Construct the WhatsApp share URL with the specific number
    const whatsappUrl = `https://wa.me/${this.whatsappPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  }
  /**
   * Checks if a cart item is currently selected.
   * @param itemKey The unique key of the item.
   * @returns True if the item is selected, otherwise false.
   */
  isItemSelected(itemKey: string): boolean {
    return this.selectedItems.has(itemKey);
  }
   /**
   * Removes all selected items from the cart.
   */
   removeSelectedItems(): void {
    if (this.selectedItems.size === 0) {
      this.notificationService.showNotification({
        message: 'No items are selected for deletion.',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    this.selectedItems.forEach(itemKey => {
      // Split the unique key to get productId and unitLabel
      const [productId, unitLabel] = itemKey.split('_');
      this.cartService.removeFromCart(productId, unitLabel);
    this.sharedCartUrl = '';
    this.showSharedUrl = false;
    });

   

    this.notificationService.showNotification({
      message: `${this.selectedItems.size} items removed from cart successfully!`,
      type: 'error',
      duration: 3000
    });
     // Clear the selection set after all items have been removed
     this.selectedItems.clear();
  }

  /**
   * Checks if all items in the cart are selected.
   * @returns True if all items are selected, otherwise false.
   */
  isAllSelected(): boolean {
    let allSelected = false;
    this.cartItems$.subscribe(items => {
      allSelected = items.length > 0 && this.selectedItems.size === items.length;
    });
    return allSelected;
  }
   /**
   * Toggles the selection of all items in the cart.
   */
   toggleSelectAll(): void {
    this.cartItems$.subscribe(items => {
      if (this.selectedItems.size === items.length) {
        // All items are selected, so deselect all
        this.selectedItems.clear();
      } else {
        // Not all items are selected, so select all
        this.selectedItems.clear();
        items.forEach(item => {
          const itemKey = this.getUniqueItemKey(item);
          this.selectedItems.add(itemKey);
        });
      }
    });
  }

  /**
   * Displays the confirmation modal for multi-item deletion.
   */
  openConfirmationModal(): void {
    if (this.selectedItems.size === 0) {
      this.notificationService.showNotification({
        message: 'No items are selected for deletion.',
        type: 'warning',
        duration: 3000
      });
      return;
    }
    this.itemToRemove = null; // Ensure single delete state is cleared
    this.showConfirmationModal = true;
    this.modalTitle = `Delete ${this.selectedItems.size} Items`; // Set the title for multi-item deletion
    this.modalMessage = `Are you sure you want to delete these items? This action cannot be undone.`; // Set the message
  }
 /**
   * Displays the confirmation modal for single-item deletion.
   * @param productId The ID of the product.
   * @param unitLabel The label of the unit to remove.
   */
 openSingleItemConfirmationModal(productId: string, unitLabel: string): void {
  this.itemToRemove = { productId, unitLabel };
  this.showConfirmationModal = true;
  this.modalTitle = `Delete Item`; // Set the title for single-item deletion
    this.modalMessage = `Are you sure you want to delete this item? This action cannot be undone.`; // Set the message
}
  /**
   * Confirms and removes all selected items from the cart.
   */
  confirmDeletion(): void {
    
    if (this.itemToRemove) {
      // Logic for single-item deletion
      this.cartService.removeFromCart(this.itemToRemove.productId, this.itemToRemove.unitLabel);
      this.notificationService.showNotification({
        message: `Selected item removed from cart successfully!`,
        type: 'error',
        duration: 3000
      });
      this.itemToRemove = null; // Reset state
      this.showConfirmationModal = false;
    } 
    else {
    const itemsToRemoveCount = this.selectedItems.size;

    this.selectedItems.forEach(itemKey => {
      // Split the unique key to get productId and unitLabel
      const [productId, unitLabel] = itemKey.split('_');
      this.cartService.removeFromCart(productId, unitLabel);
    });

    // Clear the selection set and hide the modal after deletion
    this.selectedItems.clear();
    this.showConfirmationModal = false;

    this.notificationService.showNotification({
      message: `${itemsToRemoveCount} items removed from cart successfully!`,
      type: 'error',
      duration: 3000
    });
  }
  }
  
  /**
   * Cancels the deletion and hides the confirmation modal.
   */
  cancelDeletion(): void {
    this.showConfirmationModal = false;
    this.itemToRemove = null; // Clear any pending single-item deletion
  }
  generatePermalink(): void {
    const currentItems = this.cartService.currentCartItems;
    if (currentItems.length === 0) {
      this.notificationService.showNotification({
        message: 'Your cart is empty. Add products to generate a shareable link.',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    
    // 1. Convert cart to JSON
    const jsonString = JSON.stringify(currentItems);
    const encodedData = btoa(jsonString);
     // 2. Compress and encode for URL
     const compressed = LZString.compressToEncodedURIComponent(encodedData);
    this.sharedCartUrl = `${window.location.origin}/shared-cart?cartData=${compressed}`;
    this.showSharedUrl = true;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.sharedCartUrl).then(() => {
        this.notificationService.showNotification({
          message: 'Cart link copied to clipboard!',
          type: 'success',
          duration: 3000
        });
      });
    }
  }

}