// src/app/shared/components/notification/notification.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
// Import AppNotification instead of Notification
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppNotification, NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {
  // Use AppNotification type here
  currentNotification: AppNotification | null = null;
  private notificationSubscription!: Subscription;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationSubscription = this.notificationService.getNotification().subscribe(notification => {
      this.currentNotification = notification;
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  dismissNotification(): void {
    this.notificationService.hideNotification();
  }

  getNotificationClasses(): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'notification-container': true,
      'show': !!this.currentNotification
    };
    if (this.currentNotification) {
      classes[this.currentNotification.type] = true;
    }
    return classes;
  }
}