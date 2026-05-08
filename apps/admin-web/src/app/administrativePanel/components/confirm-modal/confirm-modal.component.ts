import { Component, output, input, signal } from '@angular/core';
import { ToastComponent } from "../toast/toast.component";

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  imports: [ToastComponent],
})
export class ConfirmModalComponent {
  itemName = input.required<string>();
  colorButton = input.required<string>();
  showToast = signal(false);
  confirm = output<void>();
  closeModal = output<void>();
  title = input.required<string>();
  message = input.required<string>();
  buttonMessage = input.required<string>();
  toastMessage = input.required<string>();
}
