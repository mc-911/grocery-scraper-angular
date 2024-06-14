import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'app-grocery-list-detail',
  standalone: true,
  imports: [NgIf, NgFor, DropdownComponent, NgSwitch, NgSwitchCase],
  templateUrl: './grocery-list-detail.component.html',
  styleUrl: './grocery-list-detail.component.css'
})
export class GroceryListDetailComponent {

  @Input({ required: true }) groceryListItems!: GroceryListItemData[]
  @Output() removeItemEvent = new EventEmitter<number>();
  supermarketDropdownItems = Object.values(SupermarketEnum).map((item) => {
    return { "name": item[0].toUpperCase() + item.substring(1), "value": item }
  })
  selectedSupermarket = SupermarketEnum.PAKNSAVE
  selectedItemIndex = 0
  currentTotal = 0
  public get SupermarketEnum() {
    return SupermarketEnum
  }

  ngOnInit() {
    const min = this.calculateMinGroceryList()
    this.currentTotal = min.minTotal
    this.selectedSupermarket = min.minSupermarket
    this.selectedItemIndex = Object.values(SupermarketEnum).findIndex((val) => val == this.selectedSupermarket)
  }
  /**
   * getImageClass
   */
  public getImageClass(supermarket: SupermarketEnum) {
    return supermarket == SupermarketEnum.COUNTDOWN ? 'countdown-image' : 'paknsave-image'
  }

  public selectSupermarket(index: number) {
    this.selectedSupermarket = this.supermarketDropdownItems[index].value
    this.selectedItemIndex = index
  }
  public removeGroceryListItem(index: number) {
    this.removeItemEvent.emit(index)
  }
  public calculateMinGroceryList() {
    let supermarkets = Object.values(SupermarketEnum)
    let minSupermarket = SupermarketEnum.PAKNSAVE
    let minTotal = Infinity
    for (let j = 0; j < supermarkets.length; j++) {
      if (this.checkSupermarketExistsinGroceryList(supermarkets[j])) {
        let total = 0
        for (let i = 0; i < this.groceryListItems.length && (total < minTotal); i++) {
          if (supermarkets[j] in this.groceryListItems[i].supermarketDataDict) {
            let price = this.groceryListItems[i].supermarketDataDict[supermarkets[j]].price
            if (this.groceryListItems[i].supermarketDataDict[supermarkets[j]].quantity) {
              price = price * this.groceryListItems[i].supermarketDataDict[supermarkets[j]].quantity!
            }
            total += price
          } else {
          }
        }
        if (total < minTotal) {
          minTotal = total
          minSupermarket = supermarkets[j]
        }
      }
    }
    return { "minTotal": minTotal, "minSupermarket": minSupermarket }
  }
  public copyMinGroceryList() {
    let minimumGroceryList = []
    let supermarkets = Object.values(SupermarketEnum)
    let minSupermarket = ""
    let minTotal = Infinity
    let minNamesList: string[] = []
    for (let j = 0; j < supermarkets.length; j++) {
      if (this.checkSupermarketExistsinGroceryList(supermarkets[j])) {
        let total = 0
        let namesList = []
        for (let i = 0; i < this.groceryListItems.length && (total < minTotal); i++) {
          if (supermarkets[j] in this.groceryListItems[i].supermarketDataDict) {
            let price = this.groceryListItems[i].supermarketDataDict[supermarkets[j]].price
            if (this.groceryListItems[i].supermarketDataDict[supermarkets[j]].quantity) {
              price = price * this.groceryListItems[i].supermarketDataDict[supermarkets[j]].quantity!
            }
            total += price
            namesList.push("- " + `${this.groceryListItems[i].supermarketDataDict[supermarkets[j]].quantity} x ` + this.groceryListItems[i].supermarketDataDict[supermarkets[j]].name + " " + this.groceryListItems[i].supermarketDataDict[supermarkets[j]].info)
          } else {
            namesList.push(`- No Item selected for ${this.groceryListItems[i].name}`)
          }
        }
        if (total < minTotal) {
          minTotal = total
          minNamesList = namesList
          minSupermarket = supermarkets[j]
        }
      }
    }
    const clipboardListString = minNamesList.join("\n")
    navigator.clipboard.writeText(minSupermarket + "\n" + clipboardListString)
  }

  public checkSupermarketExistsinGroceryList(supermarket: SupermarketEnum) {
    for (let i = 0; i < this.groceryListItems.length; i++) {
      if (supermarket in this.groceryListItems[i].supermarketDataDict) {
        return true
      }
    }
    return false
  }

  public getSupermarketGroceryList(supermarket: SupermarketEnum) {
    const supermarketGroceryListItems = []
    for (let i = 0; i < this.groceryListItems.length; i++) {
      if (supermarket in this.groceryListItems[i].supermarketDataDict) {
        supermarketGroceryListItems.push(this.groceryListItems[i].supermarketDataDict[supermarket])
      }
    }

  }

}
