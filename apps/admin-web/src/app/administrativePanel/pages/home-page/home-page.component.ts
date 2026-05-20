import { Component, inject, computed } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { GtuRoutesService } from '../../services/gtu-routes.service';
import { GtuStopsService } from '../../services/gtu-stops.service';
import { GtuUsersService } from '../../services/gtu-users.service';
import { GtuAssignDriverService } from '../../services/gtu-assign-driver.service';

@Component({
  selector: 'app-home-page',
  imports: [HeaderComponent],
  templateUrl: './home-page.component.html',
})
export default class HomePageComponent {
  private routesService = inject(GtuRoutesService);
  private stopsService = inject(GtuStopsService);
  private usersService = inject(GtuUsersService);
  private assignDriverService = inject(GtuAssignDriverService);

  private formatNumber(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }

  totalRoutes = computed(() => this.formatNumber(this.routesService.routes().length));
  totalStops = computed(() => this.formatNumber(this.stopsService.stops().length));
  totalUsers = computed(() => this.formatNumber(this.usersService.users().length));
  totalAssignments = computed(() => this.formatNumber(this.assignDriverService.assignDrivers().length));
}


