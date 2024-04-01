import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() selectOptionEvent = new EventEmitter<string>();
  selectedOption = 0;
  optionsVisible = false;

  public selectOption(index: number) {
    this.selectedOption = index;
    this.selectOptionEvent.emit(this.options[this.selectedOption].value)
    this.optionsVisible = false;
  }

  public toggleDropdown() {
    this.optionsVisible = !this.optionsVisible;
  }
}
