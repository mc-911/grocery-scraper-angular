import { Component, Input } from '@angular/core';
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';

export enum SupermarketEnum {
  PAKNSAVE,
  COUNTDOWN,
  NEW_WORLD
}
type GroceryItemSupermarketData = {
  dollars: number,
  cents: number,
  supermarket: SupermarketEnum
  content: string
  productCode: number,
}

export type GroceryListItemData = {
  name: string,
  SupermarketDataDict: { [key: number]: GroceryItemSupermarketData }
}
@Component({
  selector: 'app-grocery-list-item',
  standalone: true,
  imports: [PacknSaveSvgComponent, CountdownSvgComponent, NgFor, NgSwitch, NgSwitchCase, NewWorldSvgComponent],
  templateUrl: './grocery-list-item.component.html',
  styleUrl: './grocery-list-item.component.css'
})
export class GroceryListItemComponent {
  @Input() data: GroceryListItemData = { name: '', SupermarketDataDict: {} }
  supermarketClassList = ['paknsave-bg', 'countdown-bg', 'newworld-bg']
  /**
   * getValueArray
   */
  public getSupermarketDataArray() {
    return Object.values(this.data.SupermarketDataDict);
  }
}
