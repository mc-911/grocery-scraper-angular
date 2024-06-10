import { Component, EventEmitter, Output } from '@angular/core';
import { GroceryListInfo, GroceryService } from '../grocery.service';
import { EMPTY, catchError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-view-grocery-lists',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './view-grocery-lists.component.html',
  styleUrl: './view-grocery-lists.component.css'
})
export class ViewGroceryListsComponent {
  groceryLists: GroceryListInfo[] = []
  loadingLists = false;

  @Output() returnBtnClickEvent = new EventEmitter()
  @Output() groceryListDeletedEvent = new EventEmitter<string>()
  constructor(public groceryService: GroceryService) { }
  ngOnInit() {
    this.fetchGroceryLists()
  }

  public fetchGroceryLists() {
    this.groceryService.getGroceryLists().pipe(catchError(() => {
      console.log("Error");
      return EMPTY
    })).subscribe((response) => {
      this.groceryLists = response
    })
  }

  public deleteGroceryList(index: number) {
    const groceryListId = this.groceryLists[index].id
    this.groceryService.deleteGroceryList(groceryListId).pipe(catchError(() => {
      return EMPTY
    })).subscribe(() => {
      this.groceryLists.splice(index, 1)
      this.groceryListDeletedEvent.emit(groceryListId)
    }
    )
  }

  public return() {
    this.returnBtnClickEvent.emit()
  }

}
