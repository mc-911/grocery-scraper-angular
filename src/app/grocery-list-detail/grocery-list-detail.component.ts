import { Component, Input } from '@angular/core';
import { GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-grocery-list-detail',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './grocery-list-detail.component.html',
  styleUrl: './grocery-list-detail.component.css'
})
export class GroceryListDetailComponent {

  @Input({ required: true }) groceryListItems!: GroceryListItemData[]

  public get SupermarketEnum() {
    return SupermarketEnum
  }

  /**
   * getImageClass
   */
  public getImageClass(supermarket: SupermarketEnum) {
    return supermarket == SupermarketEnum.COUNTDOWN ? 'countdown-image' : 'paknsave-image'
  }

}
