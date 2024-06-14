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
  @Output() menuBtnClickEvent = new EventEmitter();
  @Output() detailBtnClickEvent = new EventEmitter();

  /**
   * emitOnClickEvent
   */
  public emitMenuBtnClickEvent() {
    this.menuBtnClickEvent.emit()
  }
  public emitdetailBtnClickEvent() {
    this.detailBtnClickEvent.emit()
  }
}
