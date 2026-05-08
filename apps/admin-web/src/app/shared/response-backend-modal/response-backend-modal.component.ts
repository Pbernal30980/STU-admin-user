import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-response-backend-modal',
  imports: [],
  templateUrl: './response-backend-modal.component.html',
  styleUrls: ['./response-backend-modal.component.css'],

})
export class ResponseBackendModalComponent {

  title= input.required<string>();
  message = input.required<string>();
  close = output();

  onClose() {
    this.close.emit();
  }
}

