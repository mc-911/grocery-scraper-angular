import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { GroceryItemData, GroceryService } from '../grocery.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-supermarket-item-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './supermarket-item-card.component.html',
  styleUrl: './supermarket-item-card.component.css'
})
export class SupermarketItemCardComponent {
  @Input() data: GroceryItemData = { name: '', price: 0, imageUrl: '', metric: '', info: '', productUrl: '', productCode: '', supermarket: SupermarketEnum.PAKNSAVE }
  // @Input() selectedGroceryListItem: GroceryListItemData | null = null;
  @Input() selected = false
  @Output() selectedGroceryListItemEvent = new EventEmitter<GroceryItemData>()


  public selectItem() {
    this.selectedGroceryListItemEvent.emit(this.data)
  }

  get name() {
    const words = this.data.name.trim().split(" ")
    var formattedWordsList: string[] = []
    words.forEach((word) => {
      try {
        if (word.length > 1) {
          formattedWordsList.push(word[0].toUpperCase() + word.slice(1))
        } else if (words.length == 1) {
          formattedWordsList.push(word[0].toUpperCase())
        }
      }
      catch (error) {
        console.log("Error Word: ", word);
        console.log(words);
      }
    })
    return formattedWordsList.join(" ")
  }
  get dollars() {
    return Math.floor(this.data.price)
  }

  get cents() {
    return Math.floor((this.data.price - this.dollars) * 100)
  }

  get imageClass() {
    return this.data.supermarket == SupermarketEnum.COUNTDOWN ? 'countdown-image' : 'paknsave-image'
  }


}
