import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { GroceryItemData, searchStateEnum } from '../grocerylist/grocerylist.component';

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
  SupermarketDataDict: { [key: number]: GroceryItemSupermarketData },
  results?: { [key: string]: GroceryItemData[] },
  searchState: searchStateEnum,
  searchQuery: string
}
@Component({
  selector: 'app-grocery-list-item',
  standalone: true,
  imports: [PacknSaveSvgComponent, CountdownSvgComponent, NgFor, NgSwitch, NgSwitchCase, NewWorldSvgComponent],
  templateUrl: './grocery-list-item.component.html',
  styleUrl: './grocery-list-item.component.css'
})
export class GroceryListItemComponent {
  @Input() data: GroceryListItemData = { name: '', SupermarketDataDict: {}, searchState: searchStateEnum.NO_SEARCH, searchQuery: '' }
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() selectItemEvent = new EventEmitter<number>();
  @Input() index = 0;
  @Input()
  @HostBinding('style.--border-color')
  borderColor = 'black'
  supermarketClassList = ['paknsave-bg', 'countdown-bg', 'newworld-bg']
  /**
   * getValueArray
   */
  public getSupermarketDataArray() {
    return Object.values(this.data.SupermarketDataDict);
  }

  /**
   * removeItem
   */
  public removeItem() {
    this.removeItemEvent.emit(this.index)
  }

  /**
   * selectItem
   */
  public selectItem() {
    this.selectItemEvent.emit(this.index)
  }

  public getFormattedPrice(dollars: number, cents: number) {
    const formatter = new Intl.NumberFormat("en-NZ", { style: 'currency', currency: 'NZD' })
    return formatter.format(dollars + cents / 100)
  }


}
