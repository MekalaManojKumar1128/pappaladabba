// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

// Define an interface for your category data (consistent with ProductsComponent)
interface Category {
  name: string;
  value: string;
  imageUrl: string; // <--- ADDED: imageUrl property
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // Array of banner images for the slider
  bannerImages: { src: string; alt: string; title: string; subtitle: string; buttonText: string; buttonLink: string; }[] = [
    {
      src: 'https://pappaladabba.com/wp-content/uploads/2024/01/1-1.png', // Corrected URL
      alt: 'Sweet Shop Banner 1',
      title: '',
      subtitle: '',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    },
    {
      src: 'https://pappaladabba.com/wp-content/uploads/2024/01/WhatsApp-Image-2024-01-06-at-3.30.11-PM.jpeg', // Corrected URL
      alt: 'Sweet Shop Banner 2',
      title: '',
      subtitle: '',
      buttonText: 'Explore Categories',
      buttonLink: '/products'
    },
    {
      src: 'https://mithaiandmore.in/cdn/shop/files/bombay-halwa-_-Banner_homepage-banner_07428932-0d73-45db-83aa-8849c7692368_1400x.jpg?v=1663829157', // Corrected URL
      alt: 'Sweet Shop Banner 3',
      title: '',
      subtitle: '',
      buttonText: 'Order Now',
      buttonLink: '/products'
    }
  ];

  currentSlideIndex: number = 0;
  private slideIntervalSubscription: Subscription | undefined;

   // Categories data (should be consistent with ProductsComponent)
   categories: Category[] = [
    { name: 'Sweets', value: 'sweets', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/S_0007.jpg' },
    { name: 'Snacks', value: 'snacks', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/S_0016.jpg' },
    { name: 'Pickles', value: 'pickles', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/P_0003-1.jpg' },
    { name: 'Podulu', value: 'podulu', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2023/10/Palli-Karampodi-v01.jpg' },
    { name: 'Vadiyaalu', value: 'vadiyaalu', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/Biyyam-Pindi-Vadiyaalu-e1704541649774.jpg' },
    { name: 'Bulk Orders', value: 'bulk-orders', imageUrl: 'https://pappaladabba.com/wp-content/uploads/2023/10/1000X1000v01pal.jpg' }
  ];

  // Example data for featured products (kept from your last provided version)
  featuredProducts = [
    { id: '1', name: 'Bellam Gavvalu', price: 120, imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/1000-X1000_v02bm.jpg' },
    { id: '2', name: 'Kaju Katli', price: 250, imageUrl: 'https://pappaladabba.com/wp-content/uploads/2023/10/1000X1000v02kkl-300x300.jpg' },
    { id: '3', name: 'Nuvvula Ariselu', price: 200, imageUrl: 'https://pappaladabba.com/wp-content/uploads/2023/10/1000-X-1000-v01-nar.jpg' },
    { id: '4', name: 'Pootharekulu', price: 30, imageUrl: 'https://pappaladabba.com/wp-content/uploads/2024/01/puthav01.jpg' },
    { id: '5', name: 'Palakova', price: 200, imageUrl: 'https://pappaladabba.com/wp-content/uploads/2023/10/1000X1000v02pal.jpg' },
  ];

  constructor(private router: Router) { } // Inject Router

  ngOnInit(): void {
    // Start the automatic slide show
    //this.startSlideShow();
  }

  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.slideIntervalSubscription) {
      this.slideIntervalSubscription.unsubscribe();
    }
  }

  /**
   * Starts the automatic slideshow.
   */
  startSlideShow(): void {
    this.slideIntervalSubscription = interval(5000).subscribe(() => { // Change slide every 5 seconds
      this.nextSlide();
    });
  }

  /**
   * Shows the next slide in the banner.
   */
  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.bannerImages.length;
  }

  /**
   * Shows the previous slide in the banner.
   */
  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.bannerImages.length) % this.bannerImages.length;
  }

  /**
   * Sets the current slide to a specific index.
   * @param index The index of the slide to show.
   */
  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    // Reset interval if user manually changes slide
    if (this.slideIntervalSubscription) {
      this.slideIntervalSubscription.unsubscribe();
      this.startSlideShow();
    }
  }

  /**
   * Navigates to the products page, filtering by the selected category.
   * @param categoryValue The value of the category to filter by.
   */
  navigateToCategory(categoryValue: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryValue } });
  }
}