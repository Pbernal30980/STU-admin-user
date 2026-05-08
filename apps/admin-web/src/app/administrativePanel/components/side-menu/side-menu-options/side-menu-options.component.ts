import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { MenuOption } from '../../../interfaces/models.interface';
import { LogoutButtonComponent } from "../../logout/logout-button.component";

@Component({
  selector: 'app-side-menu-options',
  imports: [RouterLink, RouterLinkActive, LogoutButtonComponent],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {
  menuOptions: MenuOption[] = [

    {
      icon: 'fa-solid fa-house',
      label: 'Inicio',
      route: '/dashboard/home',
      style: 'color:#FFFFFF;'
    },
    {
      icon: 'fa-solid fa-bus',
      label: 'Rutas',
      route: '/dashboard/routes',
      style: 'color:#FFFFFF;'
    },
    {
      icon: 'fa-solid fa-hand',
      label: 'Paradas',
      route: '/dashboard/stops',
      style: 'color:#FFFFFF;'
    },

    {
      icon: 'fa-solid fa-users',
      label: 'Usuarios',
      route: '/dashboard/users',
      style: 'color:#FFFFFF;'
    },
    {
      icon: 'fa-solid fa-route',
      label: 'Asignar Conductor',
      route: '/dashboard/assign-driver',
      style: 'color:#FFFFFF;'
    },
]
}
