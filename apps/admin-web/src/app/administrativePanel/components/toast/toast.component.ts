import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  message= input.required<string>();
  color = input.required<string>();
  visible = signal(false);

  constructor() {
    effect(() => {
      if (this.message()) {
        this.visible.set(true);
        setTimeout(() => {this.visible.set(false);}, 3000);
      }
    });
  }

}
