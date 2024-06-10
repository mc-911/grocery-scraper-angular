import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GroceryService } from '../grocery.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { EMPTY, catchError } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  autoSearchCheckBox = new FormControl(false)
  @Output() returnBtnClickEvent = new EventEmitter()

  constructor(private groceryService: GroceryService, private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.autoSearchCheckBox.setValue(this.groceryService.autoSearch)
    this.autoSearchCheckBox.valueChanges.subscribe((val) => this.groceryService.autoSearch = val!)
  }
  public return() {
    this.returnBtnClickEvent.emit()
  }

  public deleteAccount() {
    const userId = this.userService.userId;
    if (userId) {
      this.userService.deleteUser(userId).pipe(catchError(() => {
        return EMPTY
      })).subscribe(() => {
        this.userService.logOut()
      })
    } else {
      console.log("No User Id");

    }
  }
}
