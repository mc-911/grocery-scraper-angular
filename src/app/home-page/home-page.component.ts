import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroceryListInfo, GroceryService } from '../grocery.service';
import { EMPTY, catchError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { SettingsComponent } from '../settings/settings.component';
import { ViewGroceryListsComponent } from '../view-grocery-lists/view-grocery-lists.component';
import { CreateGroceryListComponent } from '../create-grocery-list/create-grocery-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, SettingsComponent, ViewGroceryListsComponent, CreateGroceryListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  firstName = "Mustapha"



  @ViewChild("createGroceryListModal") createGroceryListModal!: ElementRef<HTMLDialogElement>
  @ViewChild("viewGroceryListsModal") viewGroceryListsModal!: ElementRef<HTMLDialogElement>
  @ViewChild("settingsDialog") settingsDialog!: ElementRef<HTMLDialogElement>

  constructor(private userService: UserService) { }




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



  public logOut() {
    this.userService.logOut()
  }


}
