// src/app/pages/checkout/checkout.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { NotificationService } from '../../services/notification/notification.service';

import { CartItem } from '../../shared/models/cart.model'; // Adjust path if needed
import { Order } from '../../shared/models/order.model';
import { Address } from '../../shared/models/address.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule for ngModel
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  // Model for shipping address form
  shippingAddress: Address = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  };

  // Selected payment method
  selectedPaymentMethod: 'cod' | 'credit_card' | 'upi' = 'cod'; // Default to COD

  isPlacingOrder: boolean = false; // To disable button during API call
  showUpiConfirmation: boolean = false; // NEW: Controls visibility of UPI confirmation step
  private pendingOrderData: Omit<Order, 'id' | 'status' | 'orderDate'> | null = null; // NEW: Store order data temporarily

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.cartItems$ = this.cartService.cart$.pipe(map(cart => cart.items));
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    // Optionally, check if cart is empty and redirect if it is.
    this.cartService.cart$.subscribe(cart => {
      if (cart.items.length === 0) {
        this.notificationService.showNotification({
          message: 'Your cart is empty. Please add items before checking out.',
          type: 'info',
          duration: 3000
        });
        this.router.navigate(['/cart']); // Redirect to cart page
      }
    });
  }

  /**
   * Handles the form submission to place the order.
   */
  placeOrder(): void {
    this.isPlacingOrder = true; // Disable button

    // Get current cart items and total synchronously for the order data
    const currentCartItems = this.cartService.currentCartItems;
    let currentCartTotal = 0;
    this.cartTotal$.subscribe(total => currentCartTotal = total).unsubscribe(); // Get current total

    if (currentCartItems.length === 0 || currentCartTotal === 0) {
      this.notificationService.showNotification({
        message: 'Your cart is empty. Cannot place an empty order.',
        type: 'error',
        duration: 3000
      });
      this.isPlacingOrder = false;
      return;
    }

    // Prepare the order data
    this.pendingOrderData = { // Store order data for later confirmation
      items: currentCartItems,
      totalAmount: currentCartTotal,
      shippingAddress: this.shippingAddress,
      paymentMethod: this.selectedPaymentMethod
    };

    // Conditional processing based on payment method
    if (this.selectedPaymentMethod === 'credit_card') {
      this.processCreditCardPayment(this.pendingOrderData);
    } else if (this.selectedPaymentMethod === 'upi') {
      this.processUpiPayment(this.pendingOrderData);
    } else { // COD
      this.submitOrderToService(this.pendingOrderData); // For COD, directly submit and redirect
    }
  }

  /**
   * Submits the order data to the OrderService.
   * @param orderData The order details.
   * @param redirectAfterOrder Optional: Whether to redirect to confirmation page. Set to false for payment flows.
   */
  private submitOrderToService(orderData: Omit<Order, 'id' | 'status' | 'orderDate'>, redirectAfterOrder: boolean = true): void {
    this.orderService.placeOrder(orderData).subscribe({
      next: (responseOrder: Order) => {
        this.notificationService.showNotification({
          message: `Order placed successfully! Your order ID is ${responseOrder.id}.`,
          type: 'success',
          duration: 5000
        });
        this.cartService.clearCart(); // Clear cart after successful order
        this.pendingOrderData = null; // Clear pending data
        if (redirectAfterOrder) {
          this.router.navigate(['/order-confirmation', responseOrder.id]); // Navigate to confirmation page
        }
      },
      error: (error) => {
        console.error('Order placement failed:', error);
        this.notificationService.showNotification({
          message: 'Failed to place order. Please try again.',
          type: 'error',
          duration: 5000
        });
        this.isPlacingOrder = false; // Re-enable button
      },
      complete: () => {
        // Re-enable button only if payment is complete or COD
        if (this.selectedPaymentMethod === 'cod' || !this.showUpiConfirmation) {
           this.isPlacingOrder = false;
        }
      }
    });
  }

  /**
   * Dummy function for handling credit card submission.
   * In a real scenario, this would integrate with a payment gateway.
   */
  private processCreditCardPayment(orderData: Omit<Order, 'id' | 'status' | 'orderDate'>): void {
    this.notificationService.showNotification({
      message: 'Redirecting to Credit Card payment gateway...',
      type: 'info',
      duration: 3000
    });

    // Simulate redirection to a payment gateway
    setTimeout(() => {
      console.log('Simulating redirect to credit card gateway...');
      this.notificationService.showNotification({
        message: 'Please complete your credit card payment in the new window/tab.',
        type: 'info',
        duration: 5000
      });
      // After external payment, your backend would update order status via webhook,
      // and then you might redirect to order confirmation.
      // For now, we simulate an order being placed (pending payment) and redirect.
      this.submitOrderToService(orderData, true); // Still place order, but it would be 'pending_payment'
    }, 2000);
  }

  /**
   * Initiates UPI payment by requesting a deep link and opening it.
   * This method now *does not* call `submitOrderToService` immediately.
   * It sets a flag to show the UPI confirmation step.
   */
  private processUpiPayment(orderData: Omit<Order, 'id' | 'status' | 'orderDate'>): void {
    this.isPlacingOrder = true; // Keep button disabled while we wait for user to act
    this.showUpiConfirmation = true; // Show the UPI confirmation UI

    this.notificationService.showNotification({
      message: 'Generating UPI link...',
      type: 'info',
      duration: 2000
    });

    // Simulate backend generating a UPI deep link
    this.orderService.initiateUpiPayment(orderData.totalAmount, 'TEMP-ORDER-ID').subscribe({
      next: (upiDeepLink: string) => {
        console.log('Opening UPI deep link:', upiDeepLink);
        window.open(upiDeepLink, '_blank'); // Opens in a new tab/window

        this.notificationService.showNotification({
          message: 'UPI app opened. Please complete payment there and then click "Confirm Payment" below.',
          type: 'success',
          duration: 9000 // Give user time to see this and interact with UPI app
        });

        // The button remains 'Processing Payment...' and is disabled until user clicks "Confirm Payment"
        // No redirect here, we wait for user action.
      },
      error: (error) => {
        console.error('Failed to initiate UPI payment:', error);
        this.notificationService.showNotification({
          message: 'Failed to initiate UPI payment. Please try again.',
          type: 'error',
          duration: 5000
        });
        this.isPlacingOrder = false; // Re-enable button on error
        this.showUpiConfirmation = false; // Hide confirmation UI
        this.pendingOrderData = null; // Clear pending data
      }
    });
  }

  /**
   * NEW: This method is called by the user to manually confirm UPI payment completion.
   * In a real app, this would be a webhook from the payment gateway.
   */
  confirmUpiPayment(): void {
    if (this.pendingOrderData) {
      this.notificationService.showNotification({
        message: 'Confirming UPI payment and placing order...',
        type: 'info',
        duration: 3000
      });
      // Now, actually place the order after "payment completion" is confirmed by user
      this.submitOrderToService(this.pendingOrderData, true);
      this.showUpiConfirmation = false; // Hide confirmation UI
    } else {
      this.notificationService.showNotification({
        message: 'No pending order to confirm. Please start checkout again.',
        type: 'error',
        duration: 3000
      });
      this.isPlacingOrder = false;
    }
  }

  /**
   * Helper to ensure basic address fields are filled.
   * For a real app, use Angular's Reactive Forms for robust validation.
   */
  isAddressFormValid(): boolean {
    const address = this.shippingAddress;
    return !!address.fullName &&
           !!address.addressLine1 &&
           !!address.city &&
           !!address.state &&
           !!address.postalCode &&
           !!address.country &&
           !!address.phoneNumber;
  }
}
