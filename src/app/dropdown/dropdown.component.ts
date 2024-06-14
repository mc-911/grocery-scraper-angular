import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';

type dropdownItem = {
  name: string,
  value: string
}
@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() options: dropdownItem[] = []
  @Output() selectOptionEvent = new EventEmitter<number>();
  @Input() selectedOption = 0;
  optionsVisible = false;
  callback = (event: Event) => {
    const element = (event.target as HTMLElement);
    const nativeElement = (this.el.nativeElement as HTMLElement)
    if (!nativeElement.contains(element)) {
      this.optionsVisible = false
      window.removeEventListener("click", this.callback)
    }
  }

  constructor(private el: ElementRef) { }
  public selectOption(index: number) {
    this.selectedOption = index;
    this.selectOptionEvent.emit(index)
    this.toggleDropdown()
    window.removeEventListener("click", this.callback)
  }

  public toggleDropdown() {
    this.optionsVisible = !this.optionsVisible;
    if (this.optionsVisible) {
      window.addEventListener("click", this.callback)
    }
  }
}
