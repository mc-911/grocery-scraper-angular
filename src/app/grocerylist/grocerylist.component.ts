import { Component } from '@angular/core';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component'
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { SupermarketItemCardComponent } from '../supermarket-item-card/supermarket-item-card.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { GroceryListItemComponent, GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';

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
enum searchStateEnum {
  NO_SEARCH,
  LOADING,
  SEARCHED
}
@Component({
  selector: 'app-grocerylist',
  standalone: true,
  imports: [CountdownSvgComponent, PacknSaveSvgComponent, SupermarketItemCardComponent, NgFor, NgSwitch, NgSwitchCase, NgIf, ReactiveFormsModule, GroceryListItemComponent, NewWorldSvgComponent],
  templateUrl: './grocerylist.component.html',
  styleUrl: './grocerylist.component.css'
})
export class GrocerylistComponent {
  groceryListItems: GroceryListItemData[] = [{ name: "Test Item", SupermarketDataDict: {} }]
  selectedGroceryListItem: GroceryListItemData | null = null
  supermarketDataDictonary: { [key: string]: GroceryItemData[] } = {}
  selectedSupermarkets: string[] = ["paknsave"]
  order = "ASC"
  category = "GENERAL"
  searchState = searchStateEnum.NO_SEARCH;
  searchQuery = new FormControl('');
  newGroceryListItemName = new FormControl('')
  newGroceryListSearchQuery = new FormControl('')
  public search() {
    if (this.searchQuery.value) {
      this.getGrocerySearch(this.searchQuery.value, this.selectedSupermarkets, this.order, this.category)
    }
  }
  public getGrocerySearch(query: string, selectedSupermarkets: string[], order: string, category: string) {
    this.searchState = searchStateEnum.LOADING;
    axios.get(`http://localhost:5000/grocery-search?query=${query}&supermarket=${selectedSupermarkets}&order=${order}&category=${category}`).then((response: AxiosResponse) => {
      this.supermarketDataDictonary = response.data
      console.log(response.data)
      this.searchState = searchStateEnum.SEARCHED;
    }).catch((error: AxiosError) => {
      console.log(error)
    })
  }
  public toggleSupermarket(event: Event, supermarket: string) {
    const index = this.selectedSupermarkets.findIndex((value) => value == supermarket)
    console.log(index)
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
  public addGroceryListItem() {
    if (this.newGroceryListItemName.value && this.newGroceryListSearchQuery.value) {
      this.selectedGroceryListItem = { name: this.newGroceryListItemName.value, SupermarketDataDict: {} }
      console.log(this.selectedGroceryListItem)
      this.groceryListItems.push(this.selectedGroceryListItem)
      this.searchQuery.setValue(this.newGroceryListSearchQuery.value)
      this.search()
      this.newGroceryListItemName.setValue('')
      this.newGroceryListSearchQuery.setValue('')
      this.toggleAddGroceryListModal()
    } else {
      console.log(0)
    }
  }

}
