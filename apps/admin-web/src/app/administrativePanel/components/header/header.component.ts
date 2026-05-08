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
}
