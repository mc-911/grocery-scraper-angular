import { Component, Input } from '@angular/core';
import { GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { GroceryItemData } from '../grocery.service';

@Component({
  selector: 'app-supermarket-item-card',
  standalone: true,
  imports: [],
  templateUrl: './supermarket-item-card.component.html',
  styleUrl: './supermarket-item-card.component.css'
})
export class SupermarketItemCardComponent {
  @Input() data: GroceryItemData = { name: '', price: 0, imageUrl: '', metric: '', info: '', productUrl: '', productCode: '' }
  @Input() supermarket: SupermarketEnum = 0;
  @Input() selectedGroceryListItem: GroceryListItemData | null = null;

  public selectItem() {
    if (this.isSelected()) {
      delete this.selectedGroceryListItem?.SupermarketDataDict[this.supermarket];
    } else if (this.selectedGroceryListItem) {
      this.selectedGroceryListItem.SupermarketDataDict[this.supermarket] = { price: this.data.price, supermarket: this.supermarket, content: this.data.info, productCode: this.data.productCode }
    }
    console.log(this.selectedGroceryListItem)
  }

  public isSelected() {
    if (this.selectedGroceryListItem && this.selectedGroceryListItem.SupermarketDataDict[this.supermarket]) {
      return this.selectedGroceryListItem.SupermarketDataDict[this.supermarket].productCode === this.data.productCode
    } else {
      return false;
    }
  }

  get dollars() {
    return Math.floor(this.data.price)
  }

  get cents() {
    return this.data.price - this.dollars * 100
  }


}
