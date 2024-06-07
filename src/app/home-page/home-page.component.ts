import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroceryListInfo, GroceryService } from '../grocery.service';
import { EMPTY, catchError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  firstName = "Mustapha"

  newGroceryListName = new FormControl('')
  groceryLists: GroceryListInfo[] = []
  loadingLists = false;

  @ViewChild("createGroceryListModal") createGroceryListModal!: ElementRef<HTMLDialogElement>
  @ViewChild("viewGroceryListsModal") viewGroceryListsModal!: ElementRef<HTMLDialogElement>

  constructor(private groceryService: GroceryService, private router: Router) { }

  ngOnInit() {
    this.fetchGroceryLists()
  }
  /**
   * createGroceryList
   */
  public createGroceryList() {
    if (this.newGroceryListName.value) {
      this.groceryService.createGroceryList(this.newGroceryListName.value).pipe(catchError(() => {
        console.log("Error");
        return EMPTY
      })).subscribe((response) => {
        this.navigateToList(response.id)
      })
      this.newGroceryListName.setValue("")
    }
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

  public fetchGroceryLists() {
    this.groceryService.getGroceryLists().pipe(catchError(() => {
      console.log("Error");
      return EMPTY
    })).subscribe((response) => {
      this.groceryLists = response
    })
  }

  public navigateToList(id: string) {
    this.router.navigate(["grocerylist", id])
  }
}
