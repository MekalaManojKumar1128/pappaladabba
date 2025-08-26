// src/app/components/modal/confirmation-modal.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {

  /**
   * Input property for the title of the modal.
   */
  @Input() title: string = 'Confirm Action';

  /**
   * Input property for the message to be displayed in the modal.
   */
  @Input() message: string = 'Are you sure you want to proceed? This action cannot be undone.';

  /**
   * Input property for the path of the icon to be displayed.
   */
  @Input() iconPath: string = '';

  /**
   * Output event that emits when the user confirms the action.
   */
  @Output() confirm = new EventEmitter<void>();

  /**
   * Output event that emits when the user cancels the action.
   */
  @Output() cancel = new EventEmitter<void>();

  /**
   * Emits the confirm event.
   */
  onConfirm(): void {
    this.confirm.emit();
  }

  /**
   * Emits the cancel event.
   */
  onCancel(): void {
    this.cancel.emit();
  }
}
