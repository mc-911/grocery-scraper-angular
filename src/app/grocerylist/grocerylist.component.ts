import { Component, ElementRef } from '@angular/core';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component'
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { SupermarketItemCardComponent } from '../supermarket-item-card/supermarket-item-card.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { GroceryListItemComponent, GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NotificationContainerComponent } from '../notification-container/notification-container.component';
import { TotalContainerComponent } from '../total-container/total-container.component';

export type GroceryItemData = {
  name: string,
  dollars: number,
  cents: number,
  metric: string,
  imageUrl: string
  subtitle: string
  productUrl: string
  productCode: number,
}
export enum searchStateEnum {
  NO_SEARCH,
  LOADING,
  SEARCHED
}
@Component({
  selector: 'app-grocerylist',
  standalone: true,
  imports: [CountdownSvgComponent, PacknSaveSvgComponent, SupermarketItemCardComponent, NgFor, NgSwitch, NgSwitchCase, NgIf, ReactiveFormsModule, GroceryListItemComponent, NewWorldSvgComponent, DropdownComponent, NotificationContainerComponent, TotalContainerComponent],
  templateUrl: './grocerylist.component.html',
  styleUrl: './grocerylist.component.css'
})
export class GrocerylistComponent {
  groceryListItems: GroceryListItemData[] = [{ name: "Test Item", SupermarketDataDict: {}, searchState: searchStateEnum.NO_SEARCH, searchQuery: '' }]
  selectedGroceryListItem: GroceryListItemData | null = null
  selectedSupermarkets: string[] = ["paknsave"]
  searchQuery = new FormControl('');
  newGroceryListItemName = new FormControl('')
  newGroceryListSearchQuery = new FormControl('disabled')
  categories = [{ name: 'General', value: 'GENERAL' }, { name: 'Beef', value: 'BEEF' }, { name: 'Lamb', value: 'LAMB' }, { name: 'Pork', value: 'PORK' }, { name: 'Chicken', value: 'CHICKEN' }, { name: 'Vegetable', value: 'VEGETABLE' }, { name: 'Fruit', value: 'FRUIT' }, { name: 'Eggs', value: 'EGGS' }]
  sortingOptions = [{ name: 'Price - Low to High', value: 'ASC' }, { name: 'Price - High to Low', value: 'DESC' }]
  selectedCategory = ''
  selectedSort = ''
  notifications: string[][] = []
  mobile = false;
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.selectedCategory = this.categories[0].value
    this.selectedSort = this.sortingOptions[0].value
    this.mobile = window.innerWidth <= 480;
  }
  public search() {
    let errors = [];
    if (!this.searchQuery.value) {
      errors.push('Please enter a seach query')
    }
    if (this.selectedSupermarkets.length === 0) {
      errors.push('Please select a Supermarket')
    }
    if (errors.length == 0) {
      if (this.searchQuery.value && this.selectedGroceryListItem) {
        this.selectedGroceryListItem.searchQuery = this.searchQuery.value;
      }
      this.getGrocerySearch(this.searchQuery.value!, this.selectedSupermarkets, this.selectedSort, this.selectedCategory)
    } else {
      this.addNotification(errors)
    }
  }
  public getGrocerySearch(query: string, selectedSupermarkets: string[], order: string, category: string) {
    if (this.selectedGroceryListItem) {
      this.selectedGroceryListItem.searchState = searchStateEnum.LOADING;
    }
    axios.get(`http://localhost:5000/grocery-search?query=${query}&supermarket=${selectedSupermarkets}&order=${order}&category=${category}`).then((response: AxiosResponse) => {
      if (this.selectedGroceryListItem) {
        this.selectedGroceryListItem.results = response.data
        this.selectedGroceryListItem.searchState = searchStateEnum.SEARCHED;
      }
      console.log(response.data)
    }).catch((error: AxiosError) => {
      console.log(error)
    })
  }
  public toggleSupermarket(event: Event, supermarket: string) {
    const index = this.selectedSupermarkets.findIndex((value) => value == supermarket)
    if (index != -1) {
      this.selectedSupermarkets.splice(index, 1);
      (event.target as HTMLDivElement).classList.add('disabled')
    } else {
      this.selectedSupermarkets.push(supermarket);
      (event.target as HTMLDivElement).classList.remove('disabled')
    }
    console.log(this.selectedSupermarkets)
  }

  public toggleAddGroceryListModal() {
    const modal = (document.getElementById("addGroceryListItemModal") as HTMLDialogElement)
    if (!modal.open) {
      modal.showModal()
    } else {
      modal.close()
    }
  }
  public toggleSettingsModal() {
    console.log(1)
    const modal = (document.getElementById("settingsDialog") as HTMLDialogElement)
    if (!modal.open) {
      modal.showModal()
    } else {
      modal.close()
    }
  }
  public addGroceryListItem() {
    if (this.newGroceryListItemName.value) {
      this.selectedGroceryListItem = { name: this.newGroceryListItemName.value, SupermarketDataDict: {}, searchState: searchStateEnum.NO_SEARCH, searchQuery: this.newGroceryListItemName.value }
      console.log(this.selectedGroceryListItem)
      this.groceryListItems.push(this.selectedGroceryListItem)
      this.searchQuery.setValue(this.newGroceryListItemName.value)
      this.newGroceryListItemName.setValue('')
      this.newGroceryListSearchQuery.setValue('')
      this.toggleAddGroceryListModal()
    } else {
      console.log(0)
    }
  }

  public calculateMinTotal() {
    let total = 0;
    for (let i = 0; i < this.groceryListItems.length; i++) {
      const entries = Object.entries(
        this.groceryListItems[i].SupermarketDataDict
      )
      if (entries.length > 0) {
        console.log("Calculating min price for: ", this.groceryListItems[i].name)
        const supermarketMinPricePair = entries.reduce((previousValue, currentValue) => ((currentValue[1].dollars + currentValue[1].cents / 100) < previousValue.price ? { "supermarket": currentValue[0], "price": currentValue[1].dollars + currentValue[1].cents / 100 } : previousValue), { "supermarket": entries[0][0], "price": entries[0][1].dollars + entries[0][1].cents / 100 })
        total += supermarketMinPricePair.price;
      }
    }
    return total;
  }


  public getFormattedMinTotal() {
    const formatter = new Intl.NumberFormat("en-NZ", { style: 'currency', currency: 'NZD' })
    return formatter.format(this.calculateMinTotal())
  }

  public printList() {
    console.log(this.groceryListItems)
  }

  public removeGroceryListItem(index: number) {
    console.log(index)
    this.groceryListItems.splice(index, 1)
    console.log(this.groceryListItems)
    console.log("Removing item")
  }

  public selectGroceryListItem(index: number) {
    if (
      this.selectedGroceryListItem == this.groceryListItems[index]
    ) {
      this.selectedGroceryListItem = null;
    } else {
      this.searchQuery.setValue(this.groceryListItems[index].searchQuery)
      this.selectedGroceryListItem = this.groceryListItems[index]
    }

    console.log(this.selectedGroceryListItem)
  }

  public unselectGroceryListItem() {
    this.selectedGroceryListItem = null;
  }

  public selectCategory(value: string) {
    this.selectedCategory = value
  }

  public selectSort(value: string) {
    this.selectedSort = value;
  }

  /**
   * Creates a new Notification
   */
  public addNotification(messages: string[]) {
    this.notifications.push(messages)
  }


}
