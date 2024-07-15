import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { dropdownItem } from '../dropdown/dropdown.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dropdown-checkbox',
  standalone: true,
  imports: [NgFor],
  templateUrl: './dropdown-checkbox.component.html',
  styleUrl: './dropdown-checkbox.component.css'
})
export class DropdownCheckboxComponent {
  @Input() options: dropdownItem[] = []
  @Output() selectOptionEvent = new EventEmitter<number>();
  @Input() selectedOptions: number[] = []
  @Input() label = ""
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
