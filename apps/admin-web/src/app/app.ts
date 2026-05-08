import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  imports: [RouterModule], // Eliminamos NxWelcome de aquí
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'admin-web';

  ngOnInit(): void {
    initFlowbite();
  }
}