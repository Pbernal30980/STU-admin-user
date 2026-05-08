import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  imports: [],
  templateUrl: './infoModal.component.html',
})
export class InfoModalComponent {
  item = input<any>();
  itemName = input.required<string>();
  closeModal = output<void>();



}
