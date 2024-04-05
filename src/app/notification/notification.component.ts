import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() messages: string[] = []
  @Input() messageIndex: number = 0
  @Output() removeNotificationEvent = new EventEmitter<number>();
  constructor(private el: ElementRef) {
  }
  ngOnInit() {
    console.log("Setting timeout")
    setTimeout(() => (this.el.nativeElement as HTMLElement).remove(), 2000)
  }

  public removeNotification() {
    (this.el.nativeElement as HTMLElement).remove()
    this.removeNotificationEvent.emit(this.messageIndex)
  }
}
