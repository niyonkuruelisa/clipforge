import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { ClipboardItem, ClipboardItemType } from '../models/clipboard-item.model';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  // Signals for reactive state management
  private itemsSignal = signal<ClipboardItem[]>([]);
  private filteredItemsSignal = signal<ClipboardItem[]>([]);
  private selectedTabSignal = signal<ClipboardItemType | 'all'>('all');
  private searchQuerySignal = signal<string>('');
  private loadingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly items = this.itemsSignal.asReadonly();
  readonly filteredItems = this.filteredItemsSignal.asReadonly();
  readonly selectedTab = this.selectedTabSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor() {
    // Initialize with mock data for UI testing
    this.loadMockData();
    // Load history from Tauri backend
    this.loadHistoryFromBackend();
    // Listen for clipboard updates from backend
    this.setupClipboardListener();
  }

  private async setupClipboardListener(): Promise<void> {
    try {
      await listen<ClipboardItem>('clipboard-monitor/update', (event) => {
        const newItem = {
          ...event.payload,
          timestamp: new Date(event.payload.timestamp),
        };
        
        this.itemsSignal.update((items) => {
          // Avoid duplicates if already present (though backend checks too)
          // If duplicate exists, move to top?
          // For now, just insert if not exists, matching backend logic
          if (!items.some(i => i.content === newItem.content)) {
             return [newItem, ...items];
          }
          return items;
        });
        this.filterItems();
      });
    } catch (error) {
      console.error('Failed to setup clipboard listener:', error);
    }
  }

  private loadMockData(): void {
    const mockItems: ClipboardItem[] = [
      {
        id: '1',
        type: 'text',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        preview: 'Lorem ipsum dolor sit amet...',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        isPinned: true,
      },
      {
        id: '2',
        type: 'text',
        content: 'https://github.com/tauri-apps/tauri',
        preview: 'https://github.com/tauri-apps/tauri',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: '3',
        type: 'text',
        content: 'function greet(name: string): string {\n  return `Hello, World!`;\n}',
        preview: 'function greet(name: string): string {...',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: '4',
        type: 'text',
        content: 'npm install -D tailwindcss@latest postcss autoprefixer',
        preview: 'npm install -D tailwindcss...',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        id: '5',
        type: 'text',
        content: 'https://angular.dev/overview',
        preview: 'https://angular.dev/overview',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: '6',
        type: 'text',
        content: 'Meeting notes:\n- Discuss project timeline\n- Review budget\n- Assign tasks to team members',
        preview: 'Meeting notes: Discuss project timeline...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isPinned: true,
      },
    ];

    this.itemsSignal.set(mockItems);
    this.filterItems();
  }

  private async loadHistoryFromBackend(): Promise<void> {
    try {
      this.loadingSignal.set(true);
      const history = await invoke<ClipboardItem[]>('get_clipboard_history');
      
      if (history && history.length > 0) {
        // Convert timestamp strings to Date objects
        const items = history.map(item => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        this.itemsSignal.set(items);
        this.filterItems();
      }
    } catch (error) {
      console.error('Failed to load clipboard history:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
    this.filterItems();
  }

  setSelectedTab(tab: ClipboardItemType | 'all'): void {
    this.selectedTabSignal.set(tab);
    this.filterItems();
  }

  private filterItems(): void {
    let filtered = [...this.itemsSignal()];

    // Treat all items as text; ignore type-based tabs

    // Filter by search query (supports 'pin'/'pinned' to show pinned items)
    const query = this.searchQuerySignal().toLowerCase();
    if (query) {
      const matchPinned = /\bpin(ned)?\b/.test(query);
      filtered = filtered.filter((item) => {
        const contentMatch =
          item.content.toLowerCase().includes(query) ||
          (item.preview?.toLowerCase().includes(query) ?? false);
        const pinnedMatch = matchPinned ? !!item.isPinned : false;
        return contentMatch || pinnedMatch;
      });
    }

    // Sort: newest first by timestamp only (pinning does not reorder)
    filtered.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    this.filteredItemsSignal.set(filtered);
  }

  async addItem(item: Omit<ClipboardItem, 'id' | 'timestamp'>): Promise<void> {
    const newItem: ClipboardItem = {
      ...item,
      // Force text type for all items
      type: 'text',
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    try {
      // Add to backend
      await invoke('add_to_history', { item: newItem });
      
      // Update local state
      this.itemsSignal.update((items) => [newItem, ...items]);
      this.filterItems();
    } catch (error) {
      console.error('Failed to add item to history:', error);
    }
  }

  async deleteItem(itemId: string): Promise<void> {
    try {
      // Delete from backend
      await invoke('delete_from_history', { itemId });
      
      // Update local state
      this.itemsSignal.update((items) => items.filter((item) => item.id !== itemId));
      this.filterItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  async togglePin(itemId: string): Promise<void> {
    try {
      // Toggle in backend
      await invoke('toggle_pin', { itemId });
      
      // Update local state
      this.itemsSignal.update((items) =>
        items.map((item) =>
          item.id === itemId ? { ...item, isPinned: !item.isPinned } : item
        )
      );
      this.filterItems();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  }

  async copyToClipboard(item: ClipboardItem): Promise<void> {
    try {
      // Use Tauri API to set clipboard
      await invoke('set_clipboard', { content: item.content });
      console.log('Copied to clipboard:', item.content);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback to browser API
      try {
        await navigator.clipboard.writeText(item.content);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      }
    }
  }

  async getCurrentClipboard(): Promise<string> {
    try {
      return await invoke<string>('get_clipboard');
    } catch (error) {
      console.error('Failed to get current clipboard:', error);
      return '';
    }
  }

  async clearHistory(): Promise<void> {
    try {
      await invoke('clear_history');
      this.itemsSignal.set([]);
      this.filterItems();
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }
}
