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
  @Input() data: GroceryItemData = { name: '', dollars: 0, cents: 0, imageUrl: '', metric: '', subtitle: '', productUrl: '', productCode: 0 }
  @Input() supermarket: SupermarketEnum = 0;
  @Input() selectedGroceryListItem: GroceryListItemData | null = null;

  public selectItem() {
    if (this.isSelected()) {
      delete this.selectedGroceryListItem?.SupermarketDataDict[this.supermarket];
    } else if (this.selectedGroceryListItem) {
      this.selectedGroceryListItem.SupermarketDataDict[this.supermarket] = { dollars: this.data.dollars, cents: this.data.cents, supermarket: this.supermarket, content: this.data.subtitle, productCode: this.data.productCode }
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


}
