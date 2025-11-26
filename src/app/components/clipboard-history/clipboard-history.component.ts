import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardItem } from '../../models/clipboard-item.model';
import { ClipboardItemComponent } from '../clipboard-item/clipboard-item.component';
import { ClipboardService } from '../../services/clipboard.service';

@Component({
  selector: 'app-clipboard-history',
  imports: [CommonModule, ClipboardItemComponent],
  templateUrl: './clipboard-history.component.html',
  styleUrl: './clipboard-history.component.css',
})
export class ClipboardHistoryComponent {
  @Input() items: ClipboardItem[] = [];
  @Input() loading = false;

  constructor(private clipboardService: ClipboardService) {}

  onCopy(item: ClipboardItem): void {
    this.clipboardService.pasteItem(item);
  }

  onPin(itemId: string): void {
    this.clipboardService.togglePin(itemId);
  }
}
