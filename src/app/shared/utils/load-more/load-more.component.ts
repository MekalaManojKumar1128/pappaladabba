import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-load-more',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-more.component.html',
  styleUrls: ['./load-more.component.scss']
})
export class LoadMoreComponent {
  // The number of items currently visible to the user.
  @Input({ required: true }) visibleCount!: number;
  
  // The total number of items available in the filtered list.
  @Input({ required: true }) totalCount!: number;
  
  // An event emitter that notifies the parent component when the button is clicked.
  @Output() loadMoreClicked = new EventEmitter<void>();

  /**
   * Emits the loadMoreClicked event.
   */
  onLoadMore(): void {
    this.loadMoreClicked.emit();
  }
}