import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, catchError } from 'rxjs';
import { GroceryService } from '../grocery.service';

@Component({
  selector: 'app-create-grocery-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-grocery-list.component.html',
  styleUrl: './create-grocery-list.component.css'
})
export class CreateGroceryListComponent {

  newGroceryListName = new FormControl('')
  @Output() returnBtnClickEvent = new EventEmitter()

  constructor(public groceryService: GroceryService) { }
  /**
   * createGroceryList
   */
  public createGroceryList() {
    if (this.newGroceryListName.value) {
      this.groceryService.createGroceryList(this.newGroceryListName.value).pipe(catchError(() => {
        console.log("Error");
        return EMPTY
      })).subscribe((response) => {
        this.groceryService.navigateToList(response.id)
      })
      this.newGroceryListName.setValue("")
    }
  }

  public return() {
    this.returnBtnClickEvent.emit()
  }
}
