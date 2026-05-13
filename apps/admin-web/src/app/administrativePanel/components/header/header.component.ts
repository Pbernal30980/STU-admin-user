import { Component, input } from '@angular/core';
import { SearchHeaderComponent } from './searchHeader/search-header.component';
import { NotificationHeaderComponent } from './notificationHeader/notification-header.component';
import { ProfileHeaderComponent } from './profileHeader/profile-header.component';

@Component({
  selector: 'app-header',
  imports: [SearchHeaderComponent, NotificationHeaderComponent, ProfileHeaderComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  title = input<string>('GTU Project');
  userName = localStorage.getItem('userName');
  isDarkMode = false;

  constructor() {
    // Check initial preference
    this.isDarkMode = document.documentElement.classList.contains('dark') || 
                      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
