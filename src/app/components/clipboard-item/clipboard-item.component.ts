import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardItem } from '../../models/clipboard-item.model';

@Component({
  selector: 'app-clipboard-item',
  imports: [CommonModule],
  templateUrl: './clipboard-item.component.html',
  styleUrl: './clipboard-item.component.css',
})
export class ClipboardItemComponent {
  @Input() item!: ClipboardItem;
  @Output() copy = new EventEmitter<ClipboardItem>();
  @Output() delete = new EventEmitter<string>();
  @Output() pin = new EventEmitter<string>();

  // All items treated as text; no type-specific UI

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  }

  onCopy(): void {
    this.copy.emit(this.item);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.item.id);
  }

  onPin(event: Event): void {
    event.stopPropagation();
    this.pin.emit(this.item.id);
  }
}
