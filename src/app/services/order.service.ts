// src/app/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { Order } from '../shared/models/order.model';
import { CartItem } from '../shared/models/cart.model'; // Assuming this already exists, or use the one from order.model.ts

/**
 * Service for handling order-related operations, primarily placing new orders.
 * In a real application, this would interact with a backend API.
 */
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // In a real app, this would be your backend API endpoint for orders
  private ordersApiUrl = '/api/orders';
  private upiApiUrl = '/api/upi/initiate'; // New simulated API endpoint for UPI

  constructor(private http: HttpClient) { }

  /**
   * Simulates placing an order.
   * In a real scenario, this would send an HTTP POST request to your backend.
   *
   * @param orderData The order details including items, total, address, and payment method.
   * @returns An Observable that emits the created Order object on success, or an error.
   */
  placeOrder(orderData: Omit<Order, 'id' | 'status' | 'orderDate'>): Observable<Order> {
    console.log('Attempting to place order with data:', orderData);

    // Simulate a backend API call
    // Using 'of' to create an observable that immediately emits a value
    // Using 'delay' to simulate network latency
    // Using 'tap' to log the operation
    return of({
      ...orderData,
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Simulate backend-generated ID
      status: orderData.paymentMethod === 'cod' ? 'confirmed' : 'pending_payment', // COD is confirmed, others await payment
      orderDate: new Date()
    }).pipe(
      delay(1500), // Simulate a 1.5-second network delay
      tap(
        (response) => {
          console.log('Order placed successfully (simulated):', response);
          // Here, you would typically make an actual HTTP call:
          // return this.http.post<Order>(this.ordersApiUrl, orderData);
        },
        (error) => {
          console.error('Error placing order (simulated):', error);
        }
      )
      // For error simulation, you could use:
      // return throwError(() => new Error('Failed to place order due to network issue'));
    );
  }

  /**
   * Simulates initiating a UPI payment by requesting a deep link from the backend.
   * In a real application, this would send an HTTP POST request to your backend
   * with order details, and the backend would respond with a UPI deep link or QR data.
   *
   * @param amount The total amount for the UPI transaction.
   * @param orderId The temporary order ID generated on frontend or initial backend ID.
   * @returns An Observable that emits the UPI deep link string on success.
   */
  initiateUpiPayment(amount: number, orderId: string): Observable<string> {
    console.log(`Simulating UPI initiation for Order ID: ${orderId}, Amount: ₹${amount}`);

    // In a real application, this would be an actual HTTP POST request to your backend:
    // return this.http.post<{ upiUrl: string }>(this.upiApiUrl, { amount, orderId }).pipe(
    //   map(response => response.upiUrl),
    //   catchError(error => {
    //     console.error('Backend failed to generate UPI link:', error);
    //     return throwError(() => new Error('Failed to initiate UPI payment.'));
    //   })
    // );

    // For this simulation, we generate a dummy UPI deep link
    //jilebi shop/ upi://pay?pa=paytmqr5kd3l7@ptys&pn=Paytm
    //Mine/ upi://pay?pa=paytmqr5o9f4z@ptys@ptys&pn=Paytm
    const dummyMerchantVpa = 'paytmqr5kd3l7@ptys'; // Replace with your actual merchant VPA
    const dummyMerchantName = 'Paytm';
    const transactionNote = encodeURIComponent(`Payment for Order ${orderId}`);
    //const upiDeepLink = `upi://pay?pa=${dummyMerchantVpa}&pn=${dummyMerchantName}&am=${amount.toFixed(2)}&cu=INR&tn=${transactionNote}&tr=${orderId}`;
    const upiDeepLink = `upi://pay?pa=BHARATPE09901389158@yesbankltd&pn=BharatPe Merchant&cu=INR&tn=Pay To BharatPe Merchant&tr=WHATSAPP_QR`;
    return of(upiDeepLink).pipe(
      delay(1000), // Simulate network delay
      tap(() => console.log('Simulated UPI deep link generated.'))
    );
  }
}
