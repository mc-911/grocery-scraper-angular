import { Routes } from '@angular/router';
import { GrocerylistComponent } from './grocerylist/grocerylist.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ResetPasswordPageComponent } from './reset-password-page/reset-password-page.component';

export const routes: Routes = [{ path: "home", component: HomePageComponent }, { path: "resetPassword", component: ResetPasswordPageComponent }, { path: 'grocerylist/:id', component: GrocerylistComponent }, { path: '', redirectTo: 'login', pathMatch: 'full' }, { path: 'login', component: LoginPageComponent }, { path: 'register', component: RegistrationPageComponent }, { path: '**', component: PageNotFoundComponent }];
