import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CountdownSvgComponent } from '../countdown-svg/countdown-svg.component'
import { PacknSaveSvgComponent } from '../packn-save-svg/packn-save-svg.component';
import { SupermarketItemCardComponent } from '../supermarket-item-card/supermarket-item-card.component';
import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { GroceryListItemComponent, GroceryListItemData, SupermarketEnum } from '../grocery-list-item/grocery-list-item.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NewWorldSvgComponent } from '../new-world-svg/new-world-svg.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NotificationContainerComponent } from '../notification-container/notification-container.component';
import { TotalContainerComponent } from '../total-container/total-container.component';
import { GroceryItemData, GroceryService } from '../grocery.service';
import { EMPTY, catchError } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { LocationService } from '../location.service';
import { GroceryListDetailComponent } from '../grocery-list-detail/grocery-list-detail.component';
import { GroceryListSearchComponent, searchStateEnum } from '../grocery-list-search/grocery-list-search.component';
import { ViewGroceryListsComponent } from '../view-grocery-lists/view-grocery-lists.component';
import { CreateGroceryListComponent } from '../create-grocery-list/create-grocery-list.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-grocerylist',
  standalone: true,
  imports: [CountdownSvgComponent, PacknSaveSvgComponent, NewWorldSvgComponent, NgFor, NgIf, ReactiveFormsModule, GroceryListItemComponent, NotificationContainerComponent, TotalContainerComponent, GroceryListDetailComponent, GroceryListSearchComponent, ViewGroceryListsComponent, CreateGroceryListComponent, SettingsComponent],
  templateUrl: './grocerylist.component.html',
  styleUrl: './grocerylist.component.css'
})
export class GrocerylistComponent {
  groceryListItems: GroceryListItemData[] = []
  selectedGroceryListItem: GroceryListItemData | null = null
  newGroceryListItemName = new FormControl('')
  newGroceryListSearchQuery = new FormControl('disabled')
  notifications: string[][] = []
  mobile = false;
  showSetPreferencesDialog = false;
  name = "Grocery List"
  selectedSupermarkets = this.groceryService.selectedSupermarkets
  @Input() id!: string;
  @ViewChild("setPreferencesDialog") setPreferencesDialog!: ElementRef<HTMLDialogElement>
  @ViewChild("optionsMenuDialog") optionsMenuDialog!: ElementRef<HTMLDialogElement>
  @ViewChild("createGroceryListModal") createGroceryListModal!: ElementRef<HTMLDialogElement>
  @ViewChild("viewGroceryListsModal") viewGroceryListsModal!: ElementRef<HTMLDialogElement>
  @ViewChild("settingsDialog") settingsDialog!: ElementRef<HTMLDialogElement>

  constructor(private el: ElementRef, private groceryService: GroceryService, private authService: AuthService, private router: Router, public userService: UserService, private locationService: LocationService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.authService.checkAuth()

    if (!this.locationService.currentLocation) {
      this.locationService.setCurrentLocation()
    }
    this.mobile = window.innerWidth <= 480;
    if (!this.id) {
      console.log("No Grocery List Id!");
    } else {
      this.groceryService.getGroceryList(this.id).pipe(catchError(() => {
        this.authService.authToken = ""
        this.authService.checkAuth()
        return EMPTY
      })).subscribe((response) => {
        console.log(response);

        this.name = response.name
        this.groceryListItems = response.items.map((item) => {
          let supermarketDataDict: { [key: string]: GroceryItemData } = {}
          item.supermarketInformation.forEach((supermarketInfo) => supermarketDataDict[supermarketInfo.supermarket] = supermarketInfo)
          return {
            name: item.name,
            supermarketDataDict: supermarketDataDict,
            searchState: searchStateEnum.NO_SEARCH,
            searchQuery: item.searchQuery,
            groceryListItemId: item.groceryListItemId
          }
        })
        console.log(this.groceryListItems);
      })
    }

  }
  ngAfterViewInit() {

    if (this.userService.isNewUser) {
      this.showSetPreferencesDialog = true
      // this.setPreferencesDialog.nativeElement.showModal()
      // this.userService.newUser = false
    }

    this.locationService.setCurrentLocation()

    console.log(this.setPreferencesDialog);
  }

  public get SupermarketEnum() {
    return SupermarketEnum
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
  public toggleOptionsModal() {
    if (!this.optionsMenuDialog.nativeElement.open) {
      this.optionsMenuDialog.nativeElement.showModal()
    } else {
      this.optionsMenuDialog.nativeElement.close()
    }
  }

  public addGroceryListItem() {
    if (this.newGroceryListItemName.value) {
      const newName = this.newGroceryListItemName.value
      const searchQuery = newName
      this.groceryService.createGroceryListItem(newName, this.id, searchQuery).pipe(catchError(() => {
        return EMPTY
      })).subscribe((response) => {
        this.selectedGroceryListItem = { name: newName, supermarketDataDict: {}, searchState: searchStateEnum.NO_SEARCH, searchQuery: searchQuery, groceryListItemId: response.id }
        console.log(this.selectedGroceryListItem)
        this.groceryListItems.push(this.selectedGroceryListItem)
        // this.searchQuery.setValue(this.newGroceryListItemName.value)
        this.newGroceryListItemName.setValue('')
        this.newGroceryListSearchQuery.setValue('')
        this.toggleAddGroceryListModal()
      })
    } else {
      console.log(0)
    }
  }
  public calculateMinTotal() {
    let total = 0;
    for (let i = 0; i < this.groceryListItems.length; i++) {
      const entries = Object.entries(
        this.groceryListItems[i].supermarketDataDict
      )
      if (entries.length > 0) {
        // console.log("Calculating min price for: ", this.groceryListItems[i].name)
        const supermarketMinPricePair = entries.reduce((previousValue, currentValue) => ((currentValue[1].price) < previousValue.price ? { "supermarket": currentValue[0], "price": currentValue[1].price } : previousValue), { "supermarket": entries[0][0], "price": entries[0][1].price })
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
    this.groceryService.deleteGroceryListItem(this.groceryListItems[index].groceryListItemId).pipe(catchError(() => {
      console.log("Grocery List Item delete failed");
      return EMPTY
    })).subscribe(() => console.log("Grocery List Item deleted")
    )
    this.groceryListItems.splice(index, 1)
  }

  public selectGroceryListItem(index: number) {
    if (
      this.selectedGroceryListItem == this.groceryListItems[index]
    ) {
      this.selectedGroceryListItem = null;
    } else {
      this.selectedGroceryListItem = this.groceryListItems[index]
    }
  }

  public unselectGroceryListItem() {
    this.selectedGroceryListItem = null;
  }


  /**
   * Creates a new Notification
   */
  public addNotification(messages: string[]) {
    this.notifications.push(messages)
  }

  public toggleSupermarket(event: Event, supermarket: string) {
    this.groceryService.toggleSupermarket(supermarket)
    this.selectedSupermarkets = this.groceryService.selectedSupermarkets
  }

  public existsGroceryItemData() {
    let supermarkets = Object.values(SupermarketEnum)
    for (let i = 0; i < this.groceryListItems.length; i++) {
      for (let j = 0; j < supermarkets.length; j++) {
        if (supermarkets[j] in this.groceryListItems[i].supermarketDataDict) {

          return true
        }
      }
    }
    console.log("Returning false");

    return false;
  }

  /**
 * toggleCreateGroceryListModal
 */
  public toggleCreateGroceryListModal() {
    if (!this.createGroceryListModal.nativeElement.open) {
      this.createGroceryListModal.nativeElement.showModal()
    } else {
      this.createGroceryListModal.nativeElement.close()
    }

  }

  /**
   * toggleViewGroceryListsModal
   */
  public toggleViewGroceryListsModal() {
    if (!this.viewGroceryListsModal.nativeElement.open) {
      this.viewGroceryListsModal.nativeElement.showModal()
    } else {
      this.viewGroceryListsModal.nativeElement.close()
    }
  }

  public toggleSettingsDialog() {
    if (!this.settingsDialog.nativeElement.open) {
      this.settingsDialog.nativeElement.showModal()
    } else {
      this.settingsDialog.nativeElement.close()
    }
  }

  public checkIfGroceryListDeleted(id: string) {
    if (id == this.id) {
      this.router.navigate(["/", "home"])
    }
  }

}
