import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-total-container',
  standalone: true,
  imports: [],
  templateUrl: './total-container.component.html',
  styleUrl: './total-container.component.css'
})
export class TotalContainerComponent {
  @Input() total = '';
  @Output() cogOnClickEvent = new EventEmitter<number>();

  /**
   * emitOnClickEvent
   */
  public emitOnClickEvent() {
    this.cogOnClickEvent.emit(1)
  }
}
