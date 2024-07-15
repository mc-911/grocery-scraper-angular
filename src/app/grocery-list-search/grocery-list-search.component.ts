import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroceryItemData, GrocerySearchCategories, GrocerySearchOrders, GroceryService, GrocerySearchQuery, GrocerySearchResponseSingle } from '../grocery.service';
import { LocationService } from '../location.service';
import { EMPTY, catchError } from 'rxjs';
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { SupermarketItemCardComponent } from '../supermarket-item-card/supermarket-item-card.component';
import { TotalContainerComponent } from '../total-container/total-container.component';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';
import { DropdownCheckboxComponent } from "../dropdown-checkbox/dropdown-checkbox.component";

export enum searchStateEnum {
  NO_SEARCH,
  LOADING,
  SEARCHED
}

@Component({
  selector: 'app-grocery-list-search',
  standalone: true,
  imports: [ReactiveFormsModule, PacknSaveSvgComponent, NewWorldSvgComponent, CountdownSvgComponent, DropdownComponent, NgSwitch, SupermarketItemCardComponent, NgIf, NgSwitchCase, TotalContainerComponent, NgFor, DropdownCheckboxComponent],
  templateUrl: './grocery-list-search.component.html',
  styleUrl: './grocery-list-search.component.css'
})
export class GroceryListSearchComponent {
  @Input({ required: true }) selectedGroceryListItem!: GroceryListItemData;
  categories = [{ name: 'General', value: GrocerySearchCategories.GENERAL }, { name: 'Beef', value: GrocerySearchCategories.BEEF }, { name: 'Lamb', value: GrocerySearchCategories.LAMB }, { name: 'Pork', value: GrocerySearchCategories.PORK }, { name: 'Chicken', value: GrocerySearchCategories.CHICKEN }, { name: 'Vegetable', value: GrocerySearchCategories.VEGETABLE }, { name: 'Fruit', value: GrocerySearchCategories.FRUIT }, { name: 'Eggs', value: GrocerySearchCategories.EGGS }]
  sortingOptions = [{ name: "Popularity", value: GrocerySearchOrders.POPULARITY }, { name: 'Price - Low to High', value: GrocerySearchOrders.ASC }, { name: 'Price - High to Low', value: GrocerySearchOrders.DESC }]
  selectedSupermarkets: string[] = []
  searchQuery = new FormControl('');
  newGroceryListItemInfo: GroceryItemData | null = null
  newGroceryListItemInfoQuantity = new FormControl(1);
  @Output() addNotificationEvent = new EventEmitter<string[]>();
  @Output() returnBtnClickEvent = new EventEmitter<boolean>();

  @ViewChild("setQuantityDialog") setQuantityDialog!: ElementRef<HTMLDialogElement>
  constructor(private groceryService: GroceryService, private locationService: LocationService, private authService: AuthService) { }
  ngOnInit() {
    if (this.selectedGroceryListItem.searchState == searchStateEnum.NO_SEARCH && this.groceryService.autoSearch) {
      this.search()
    }
    this.selectedSupermarkets = this.groceryService.selectedSupermarkets
    if (!environment.showCountdown && this.selectedSupermarkets.includes(SupermarketEnum.COUNTDOWN)) {
      this.groceryService.toggleSupermarket(SupermarketEnum.COUNTDOWN)
      this.selectedSupermarkets = this.groceryService.selectedSupermarkets
    }
  }

  ngOnChanges() {
    this.selectedSupermarkets = this.groceryService.selectedSupermarkets
    this.searchQuery.setValue(this.selectedGroceryListItem.searchQuery)
  }
  public get SupermarketEnum() {
    return SupermarketEnum
  }

  public get SearchStateEnum() {
    return searchStateEnum
  }

  get showCountdown() {
    return environment.showCountdown
  }
  public search() {
    const currentLocation = this.locationService.currentLocation
    const searchQuery = this.searchQuery.value;
    console.log(currentLocation);

    let errors = [];
    if (!searchQuery) {
      errors.push('Please enter a seach query')
    }
    if (this.selectedSupermarkets.length === 0) {
      errors.push('Please select a Supermarket')
    }
    if (!currentLocation) {
      this.locationService.setCurrentLocation()
      errors.push('Please enable your location')
    }
    if (errors.length == 0 && this.selectedGroceryListItem && searchQuery) {
      this.selectedGroceryListItem.searchQuery = searchQuery;
      this.selectedGroceryListItem.searchState = searchStateEnum.LOADING;
      let queryObj: GrocerySearchQuery = { "query": searchQuery, categories: this.selectedGroceryListItem.categories, order: this.selectedGroceryListItem.searchOrder }
      this.groceryService.grocerySearch([queryObj], this.selectedSupermarkets, currentLocation!.latitude, currentLocation!.longitude).pipe(catchError(() => {
        console.log("Handle this error")
        return EMPTY;
      })).subscribe((response) => {
        if (this.selectedGroceryListItem) {
          const singleResult: GrocerySearchResponseSingle = {}
          if (SupermarketEnum.PAKNSAVE in response) {
            singleResult[SupermarketEnum.PAKNSAVE] = response[SupermarketEnum.PAKNSAVE]![0]
          }
          if (SupermarketEnum.NEW_WORLD in response) {
            singleResult[SupermarketEnum.NEW_WORLD] = response[SupermarketEnum.NEW_WORLD]![0]
          }
          if (SupermarketEnum.COUNTDOWN in response) {
            singleResult[SupermarketEnum.COUNTDOWN] = response[SupermarketEnum.COUNTDOWN]![0]
          }
          this.selectedGroceryListItem.results = singleResult
          this.selectedGroceryListItem.searchState = searchStateEnum.SEARCHED;
          this.groceryService.updateGroceryListItem({ groceryListItemId: this.selectedGroceryListItem.groceryListItemId, searchQuery }).pipe(catchError(() => {
            console.log("Failed to update Grocery List Item!");
            return EMPTY
          })).subscribe(() => console.log("Updated Grocery List Item")
          )
        }
      })
    } else {
      this.addNotificationEvent.emit(errors)
    }
  }
  public toggleSupermarket(event: Event, supermarket: SupermarketEnum) {
    this.groceryService.toggleSupermarket(supermarket)
    this.selectedSupermarkets = this.groceryService.selectedSupermarkets
  }

  public selectCategory(index: number) {
    const newSelectedCategory = this.categories[index].value
    console.log(newSelectedCategory);
    let newList = [...this.selectedGroceryListItem.categories]
    const categoryIndex = newList.indexOf(newSelectedCategory)
    if (newSelectedCategory !== GrocerySearchCategories.GENERAL) {
      if (categoryIndex != -1) {
        if (newList.length == 1) {
          newList = [GrocerySearchCategories.GENERAL]
        } else {
          newList.splice(categoryIndex, 1);
        }
      } else {
        const generalIndex = newList.indexOf(GrocerySearchCategories.GENERAL)
        if (generalIndex != -1) {
          newList.splice(generalIndex, 1);
        }
        newList.push(newSelectedCategory);
      }
    } else {
      newList = [GrocerySearchCategories.GENERAL]
    }
    this.groceryService.updateGroceryListItem({ categories: newList, groceryListItemId: this.selectedGroceryListItem.groceryListItemId }).pipe(catchError(() => {
      //Handle this error
      return EMPTY
    })).subscribe((response) => {
      this.selectedGroceryListItem.categories = newList
    })
  }

  public selectSort(index: number) {
    const newSelectedSort = this.sortingOptions[index].value
    this.groceryService.updateGroceryListItem({ order: newSelectedSort, groceryListItemId: this.selectedGroceryListItem.groceryListItemId }).pipe(catchError(() => {
      //Handle this error
      return EMPTY
    })).subscribe((response) => {
      this.selectedGroceryListItem.searchOrder = newSelectedSort
    })
  }
  public isSelectedGroceryListInfo(productCode: string, supermarket: SupermarketEnum) {
    if (this.selectedGroceryListItem) {
      if (supermarket in this.selectedGroceryListItem.supermarketDataDict) {
        return productCode == this.selectedGroceryListItem.supermarketDataDict[supermarket].productCode
      } else {
        return false
      }
    } else {
      return false
    }
  }
  public selectGroceryListItemInfo(data: GroceryItemData) {
    // console.log("Selecting new grocery list info for: ", data.supermarket);
    // console.log(data);
    if (this.selectedGroceryListItem) {
      if (this.selectedGroceryListItem.supermarketDataDict[data.supermarket]) {
        if (data.productCode == this.selectedGroceryListItem.supermarketDataDict[data.supermarket].productCode) {
          if ("groceryListItemInfoId" in this.selectedGroceryListItem.supermarketDataDict[data.supermarket]) {
            this.groceryService.deleteGroceryListItemInfo(this.selectedGroceryListItem.supermarketDataDict[data.supermarket].groceryListItemInfoId!).pipe(catchError(() => {
              console.log("Grocery List Item Info Deletion Failed");
              return EMPTY
            })).subscribe((response) => {
              console.log("Grocery List Item Info Deletion")
              delete this.selectedGroceryListItem?.supermarketDataDict[data.supermarket];
            }
            )
          }
        } else if ("groceryListItemInfoId" in this.selectedGroceryListItem.supermarketDataDict[data.supermarket]) {
          const selectedGroceryListItem = this.selectedGroceryListItem
          data.groceryListItemInfoId = selectedGroceryListItem.supermarketDataDict[data.supermarket].groceryListItemInfoId
          selectedGroceryListItem.supermarketDataDict[data.supermarket] = data
          this.groceryService.updateGroceryListItemInfo(data.productCode, data.productUrl, data.name, data.price, data.imageUrl, data.metric, data.info, data.supermarket, this.selectedGroceryListItem.groceryListItemId, this.selectedGroceryListItem.supermarketDataDict[data.supermarket].groceryListItemInfoId!).pipe(catchError(() => {
            console.log("Grocery List Item Info Update Failed");
            return EMPTY
          })).subscribe((response) => {
            console.log("Grocery List Item Info Updated")
          }
          )
        } else {
          console.log("No Grocery List Item Info Id");
        }
      } else {
        this.newGroceryListItemInfo = data
        this.toggleSetQuantityDialog()
      }
    } else {
      console.log("No Grocery List Item selected!");
    }
  }
  public addNewGroceryListItemInfo() {
    if (this.newGroceryListItemInfo && this.newGroceryListItemInfoQuantity.value) {
      const data = this.newGroceryListItemInfo
      this.selectedGroceryListItem.supermarketDataDict[data.supermarket] = data
      const newData = this.selectedGroceryListItem.supermarketDataDict[data.supermarket]
      this.groceryService.createGroceryListItemInfo(data.productCode, data.productUrl, data.name, data.price, data.imageUrl, data.metric, data.info, data.supermarket, this.selectedGroceryListItem.groceryListItemId, this.newGroceryListItemInfoQuantity.value).pipe(catchError(() => {
        console.log("Grocery List Item Info Creation Failed");
        return EMPTY
      })).subscribe((response) => {
        console.log("Grocery List Item Info Created")
        newData.groceryListItemInfoId = response.id
        this.newGroceryListItemInfoQuantity.setValue(1)
        this.setQuantityDialog.nativeElement.close()
      }
      )
    }
  }
  public toggleSetQuantityDialog() {
    if (!this.setQuantityDialog.nativeElement.open) {
      this.setQuantityDialog.nativeElement.showModal()
    } else {
      this.setQuantityDialog.nativeElement.close()
    }
    this.newGroceryListItemInfoQuantity.setValue(1)
  }
  public get selectedCategoriesIndexArray() {
    return this.selectedGroceryListItem.categories.map((item) => this.categories.findIndex((e) => e.value == item))
  }

  public get selectedSortIndex() {
    return this.sortingOptions.findIndex((item) => item.value == this.selectedGroceryListItem.searchOrder)
  }
}
