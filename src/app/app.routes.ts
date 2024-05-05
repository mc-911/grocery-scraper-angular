import { Routes } from '@angular/router';
import { GrocerylistComponent } from './grocerylist/grocerylist.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';

export const routes: Routes = [{ path: 'grocerylist', component: GrocerylistComponent }, { path: 'login', component: LoginPageComponent }, { path: 'register', component: RegistrationPageComponent }, { path: '**', component: PageNotFoundComponent }];
