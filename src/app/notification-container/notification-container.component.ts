import { Component, Input } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [NotificationComponent, NgFor],
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.css'
})
export class NotificationContainerComponent {
  @Input() messages: string[][] = []

  /**
   * removeNotification
   */
  public removeNotification(index: number) {
    this.messages.splice(index, 1)
  }
}
