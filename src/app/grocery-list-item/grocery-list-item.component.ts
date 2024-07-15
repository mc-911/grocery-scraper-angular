import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { searchStateEnum } from '../grocery-list-search/grocery-list-search.component';
import { GroceryItemData, GrocerySearchCategories, GrocerySearchOrders, GrocerySearchResponseSingle } from '../grocery.service';

export enum SupermarketEnum {
  PAKNSAVE = "PAKNSAVE",
  COUNTDOWN = "COUNTDOWN",
  NEW_WORLD = "NEW_WORLD"
}
export type GroceryListItemData = {
  name: string,
  supermarketDataDict: { [key: string]: GroceryItemData },
  results?: GrocerySearchResponseSingle,
  searchState: searchStateEnum,
  searchQuery: string,
  groceryListItemId: string,
  searchOrder: GrocerySearchOrders,
  categories: GrocerySearchCategories[]
}
@Component({
  selector: 'app-grocery-list-item',
  standalone: true,
  imports: [PacknSaveSvgComponent, CountdownSvgComponent, NgFor, NgSwitch, NgSwitchCase, NewWorldSvgComponent],
  templateUrl: './grocery-list-item.component.html',
  styleUrl: './grocery-list-item.component.css'
})
export class GroceryListItemComponent {
  @Input({ required: true }) data!: GroceryListItemData;
  @Input({ required: true }) index!: number
  @Input()
  @HostBinding('class')
  class = ''
  @Output() removeItemEvent = new EventEmitter<number>();
  @Output() selectItemEvent = new EventEmitter<number>();
  supermarketClassList = { "PAKNSAVE": 'paknsave-bg', "COUNTDOWN": 'countdown-bg', "NEW_WORLD": 'new_world-bg' }


  public get SupermarketEnum() {
    return SupermarketEnum
  }
  /**
   * getValueArray
   */
  public getSupermarketDataArray() {
    return Object.values(this.data.supermarketDataDict);
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

  public getFormattedPrice(price: number) {
    const formatter = new Intl.NumberFormat("en-NZ", { style: 'currency', currency: 'NZD' })
    return formatter.format(price)
  }


}
