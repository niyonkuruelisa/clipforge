import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardItemType } from '../../models/clipboard-item.model';

export interface Tab {
  id: ClipboardItemType | 'all';
  label: string;
  iconName: string; // Material Symbols name
}

@Component({
  selector: 'app-tab-navigation',
  imports: [CommonModule],
  templateUrl: './tab-navigation.component.html',
  styleUrl: './tab-navigation.component.css',
})
export class TabNavigationComponent {
  @Output() tabChange = new EventEmitter<ClipboardItemType | 'all'>();

  tabs: Tab[] = [
    { id: 'all', label: '', iconName: 'assignment' },
    { id: 'text', label: '', iconName: 'emoji_emotions' },
  ];

  selectedTab: ClipboardItemType | 'all' = 'all';

  selectTab(tabId: ClipboardItemType | 'all'): void {
    this.selectedTab = tabId;
    this.tabChange.emit(tabId);
  }
}
