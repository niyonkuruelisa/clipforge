import { Component, OnInit, effect } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { TabNavigationComponent } from "./components/tab-navigation/tab-navigation.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { ClipboardHistoryComponent } from "./components/clipboard-history/clipboard-history.component";
import { ClipboardService } from "./services/clipboard.service";
import { ClipboardItemType } from "./models/clipboard-item.model";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    CommonModule,
    TabNavigationComponent,
    SearchBarComponent,
    ClipboardHistoryComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  isDarkMode = false;

  constructor(public clipboardService: ClipboardService) {
    // React to theme changes
    effect(() => {
      this.updateTheme();
    });
  }

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.updateTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onTabChange(tab: ClipboardItemType | 'all'): void {
    this.clipboardService.setSelectedTab(tab);
  }

  onSearchChange(query: string): void {
    this.clipboardService.setSearchQuery(query);
  }
}
