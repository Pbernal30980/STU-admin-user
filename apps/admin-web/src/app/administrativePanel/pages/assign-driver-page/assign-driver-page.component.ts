import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SelectedItemRouteOrDriverComponent } from "./selected-item-route-or-driver/selected-item-route-or-driver.component";
import { GtuRoutesService } from '../../services/gtu-routes.service';
import { GtuUsersService } from '../../services/gtu-users.service';
import { GtuAssignDriverService } from '../../services/gtu-assign-driver.service';

@Component({
  selector: 'app-assign-driver',
  imports: [HeaderComponent, SelectedItemRouteOrDriverComponent],
  templateUrl: './assign-driver-page.component.html',
})
export default class AssignDriverPageComponent {

  serviceRoute = inject(GtuRoutesService);
  serviceUser = inject(GtuUsersService);
  serviceAssignDriver = inject(GtuAssignDriverService);

  createDriverAssignmet() {
    this.serviceAssignDriver.createDriverAssignment(
      this.serviceRoute.routeSelected()?.id!,
      this.serviceUser.userSelected()?.id!,
    )
  }
  getRouteNameById(routeId: number): string | undefined {
    const route = this.serviceRoute.routes()?.find((route) => route.id === routeId);
    return route ? route.name : undefined;
  }

  getUserNameById(userId: number): string | undefined {
    const user = this.serviceUser.userDriver()?.find((user) => user.id === userId);
    return user ? user.name : undefined;
  }

  deleteAssignment(assignmentId: number) {
    this.serviceAssignDriver.deleteDriverAssignment(assignmentId);
  }
}
