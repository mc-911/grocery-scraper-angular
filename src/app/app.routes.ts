import { Routes } from '@angular/router';
import { GrocerylistComponent } from './grocerylist/grocerylist.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [{ path: 'grocerylist', component: GrocerylistComponent }, { path: '**', component: PageNotFoundComponent }];
