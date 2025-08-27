import { Component, EventEmitter, Output, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { DataService } from '../../../services/data/dataservice.service';
import { SearchService } from '../../../services/search/SearchService.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
 
  @Output() closed = new EventEmitter<void>();

  searchOpen = false;
  allProducts: Product[] = [];

  searchTerm = '';
  filteredProducts: any[] = [];
  isDesktop = true;

  constructor(private searchService: SearchService,private router: Router,private dataService: DataService) {}

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.filteredProducts = [];
    this.searchTerm = '';
    if (!this.searchOpen) {
      this.closed.emit();
    }
  }

  onSearch(event: Event) {

    this.allProducts=[];
    this.dataService.getAllProducts().subscribe(products => {
      this.allProducts = products;

    })
    this.searchTerm = (event.target as HTMLInputElement).value;
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.allProducts.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  goToProduct(id: number) {
    this.searchOpen = false;
    this.router.navigate(['/product-details', id]);
    this.closed.emit();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-wrapper') && this.searchOpen) {
      this.searchOpen = false;
      this.closed.emit();
    }
  }
}
