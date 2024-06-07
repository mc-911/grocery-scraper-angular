import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component';
import { NgFor, NgSwitch, NgSwitchCase } from '@angular/common';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { searchStateEnum } from '../grocery-list-search/grocery-list-search.component';
import { GroceryItemData, GrocerySearchResponse } from '../grocery.service';

export enum SupermarketEnum {
  PAKNSAVE = "paknsave",
  COUNTDOWN = "countdown",
  NEW_WORLD = "newworld"
}
export type GroceryListItemData = {
  name: string,
  supermarketDataDict: { [key: string]: GroceryItemData },
  results?: GrocerySearchResponse,
  searchState: searchStateEnum,
  searchQuery: string
  groceryListItemId: string
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
  supermarketClassList = { "paknsave": 'paknsave-bg', "countdown": 'countdown-bg', "newworld": 'newworld-bg' }


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
