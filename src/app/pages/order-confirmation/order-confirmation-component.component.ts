// src/app/pages/order-confirmation/order-confirmation.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // For accessing route parameters

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink], // Include RouterLink for navigation
  templateUrl: './order-confirmation-component.component.html',
  styleUrls: ['./order-confirmation-component.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Get the order ID from the route parameters
    this.orderId = this.route.snapshot.paramMap.get('id');
  }
}
