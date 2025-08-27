// src/app/components/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { DataService } from '../../services/data/dataservice.service';
import { Category, featuredCategory } from '../../shared/models/category.model';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  featuredProducts: featuredCategory[] = [];
  private productsSubscription?: Subscription;
  private categoriesSubscription?: Subscription;
 
 // --- Constructor + DI ---
 constructor(
  private dataService: DataService,
  private router: Router
) {}
ngOnInit(): void {
  this.categoriesSubscription = this.dataService.getCategories().subscribe(categories => {
    this.categories = categories;
  })
  this.categoriesSubscription = this.dataService.getFeaturedProducts().subscribe(categories => {
    this.featuredProducts = categories;
  })
  
}
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


  ngOnDestroy(): void {
    // Clean up the interval when the component is destroyed
    if (this.slideIntervalSubscription) {
      this.slideIntervalSubscription.unsubscribe();
    }
    this.productsSubscription?.unsubscribe();
    this.categoriesSubscription?.unsubscribe();
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