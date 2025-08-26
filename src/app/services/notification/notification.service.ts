// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'; // timer and takeUntil are not used in the current version of service

// Rename your interface to avoid conflict
export interface AppNotification { // Renamed from Notification to AppNotification
  message: string;
  type: 'success' | 'error' | 'info' | 'warning'; // You can expand these
  duration?: number; // Duration in milliseconds, default to 3000ms
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Use AppNotification type here
  private notificationSubject = new Subject<AppNotification | null>();
  private currentTimer: any;

  constructor() { }

  /**
   * Emits a new notification to be displayed.
   * @param notification The notification object.
   */
  showNotification(notification: AppNotification) { // Use AppNotification type here
    // Clear any existing timer to prevent multiple notifications overlapping
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
    }

    // Set default duration if not provided
    notification.duration = notification.duration || 1000;

    this.notificationSubject.next(notification);

    // Automatically hide the notification after a duration
    this.currentTimer = setTimeout(() => {
      this.hideNotification();
    }, notification.duration);
  }

  /**
   * Hides the current notification.
   */
  hideNotification() {
    this.notificationSubject.next(null); // Emit null to clear the current notification
    if (this.currentTimer) {
      clearTimeout(this.currentTimer);
      this.currentTimer = null;
    }
  }

  /**
   * Returns an Observable that components can subscribe to for notification updates.
   */
  getNotification(): Observable<AppNotification | null> { // Use AppNotification type here
    return this.notificationSubject.asObservable();
  }
}