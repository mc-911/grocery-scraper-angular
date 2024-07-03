import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
import { SupermarketEnum } from './grocery-list-item/grocery-list-item.component';
import { Router } from '@angular/router';
export type GroceryItemData = {
  name: string,
  price: number,
  metric: string,
  imageUrl: string
  info: string
  productUrl: string
  productCode: string
  supermarket: SupermarketEnum
  groceryListItemInfoId?: string
  quantity?: number
}
export interface GrocerySearchResponse {
  paknsave?: GroceryItemData[][]
  countdown?: GroceryItemData[][]
  newworld?: GroceryItemData[][]
}
export interface GroceryListInfo {
  name: string,
  id: string
}
export interface CreateGroceryListResponse {
  id: string
}
export interface getGroceryListResponse {
  name: string,
  items: { name: string, searchQuery: string, groceryListItemId: string, supermarketInformation: GroceryItemData[] }[]
}
export interface updateGroceryListItemBody {
  name?: string,
  searchQuery?: string
  groceryListItemId: string
}
@Injectable({
  providedIn: 'root'
})
export class GroceryService {



  constructor(private http: HttpClient, private router: Router) { }

  handleGrocerySearchError(error: HttpErrorResponse) {
    const status = error.status;
    switch (status) {
      case 400:
        return throwError(() => new Error("Invalid Request Body"))
      case 401:
        return throwError(() => new Error("Invalid Authentication Token"))
      default:
        return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }

  grocerySearch(query: string, selectedSupermarkets: string[], order: string, category: string, latitude: number, longitude: number) {
    const url = environment.apiUrl + `/grocery-search?query=${query}&supermarkets=${selectedSupermarkets}&order=${order}&category=${category}&longitude=${longitude}&latitude=${latitude}`
    return this.http.get<GrocerySearchResponse>(url).pipe(catchError(this.handleGrocerySearchError))
  }

  handleCreateGroceryListError(error: HttpErrorResponse) {
    const status = error.status;
    console.log(error);

    switch (status) {
      case 400:
        return throwError(() => new Error("Invalid Request Body"))
      case 401:
        return throwError(() => new Error("Invalid Authentication Token"))
      default:
        return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }

  createGroceryList(name: string) {
    const url = environment.apiUrl + '/grocery-list'
    return this.http.post<CreateGroceryListResponse>(url, { name }).pipe(catchError(this.handleCreateGroceryListError))
  }

  handleGetGroceryListError(error: HttpErrorResponse) {
    const status = error.status;
    switch (status) {
      case 400:
        return throwError(() => new Error("Invalid Request Body"))
      case 401:
        return throwError(() => new Error("Invalid Authentication Token"))
      default:
        return throwError(() => new Error('Uh-Oh an error has occurred; please try again later.', { cause: "unknown" }))
    }
  }
  getGroceryList(id: string) {
    const url = environment.apiUrl + '/grocery-list/' + id
    return this.http.get<getGroceryListResponse>(url).pipe(catchError(this.handleGetGroceryListError))
  }

  createGroceryListItem(name: string, groceryListId: string, searchQuery: string) {
    const url = environment.apiUrl + '/grocery-list-item'
    return this.http.post<CreateGroceryListResponse>(url, { name, groceryListId, searchQuery }).pipe(catchError(this.handleCreateGroceryListError))
  }

  updateGroceryListItem(body: updateGroceryListItemBody) {
    const url = environment.apiUrl + '/grocery-list-item'
    return this.http.patch<CreateGroceryListResponse>(url, body).pipe(catchError(this.handleCreateGroceryListError))
  }

  deleteGroceryListItem(id: string) {
    const url = environment.apiUrl + '/grocery-list-item/' + id
    return this.http.delete<any>(url).pipe(catchError(this.handleGetGroceryListError))
  }

  createGroceryListItemInfo(productCode: string, productUrl: string, name: string, price: number, imageUrl: string, metric: string, info: string, supermarket: string, groceryListItemId: string, quantity: number) {
    const url = environment.apiUrl + '/grocery-list-item-info'
    return this.http.post<CreateGroceryListResponse>(url, { productCode, name, productUrl, price, imageUrl, metric, info, supermarket, groceryListItemId, quantity }).pipe(catchError(this.handleCreateGroceryListError))
  }

  updateGroceryListItemInfo(productCode: string, productUrl: string, name: string, price: number, imageUrl: string, metric: string, info: string, supermarket: string, groceryListItemId: string, groceryListItemInfoId: string) {
    const url = environment.apiUrl + '/grocery-list-item-info'
    return this.http.put<CreateGroceryListResponse>(url, { productCode, name, productUrl, price, imageUrl, metric, info, supermarket, groceryListItemId, groceryListItemInfoId }).pipe(catchError(this.handleCreateGroceryListError))
  }

  deleteGroceryListItemInfo(id: string) {
    const url = environment.apiUrl + '/grocery-list-item-info/' + id
    return this.http.delete<any>(url).pipe(catchError(this.handleCreateGroceryListError))
  }

  deleteGroceryList(id: string) {
    const url = environment.apiUrl + '/grocery-list/' + id
    return this.http.delete<any>(url).pipe(catchError(this.handleCreateGroceryListError))
  }




  /**
   * getGroceryLists
   */
  getGroceryLists() {
    const url = environment.apiUrl + '/grocery-lists'
    return this.http.get<GroceryListInfo[]>(url).pipe(catchError(this.handleCreateGroceryListError))
  }



  public navigateToList(id: string) {
    this.router.navigate(["grocerylist", id])
  }


  public toggleSupermarket(supermarket: string) {
    const selectedSupermarkets = this.selectedSupermarkets
    const index = selectedSupermarkets.findIndex((value) => value == supermarket)
    if (index != -1) {
      selectedSupermarkets.splice(index, 1);
    } else {
      selectedSupermarkets.push(supermarket);
    }
    this.selectedSupermarkets = selectedSupermarkets
  }
  set selectedSupermarkets(supermarkets: string[]) {
    localStorage.setItem("selectedSupermarkets", JSON.stringify(supermarkets))
  }

  get selectedSupermarkets() {
    const storedSelectedSupermarkets = localStorage.getItem("selectedSupermarkets")
    let selectedSupermarkets = []
    if (storedSelectedSupermarkets) {
      try {
        selectedSupermarkets = JSON.parse(storedSelectedSupermarkets)
      }
      catch (error) {
        console.log(error);
      }
    }
    return selectedSupermarkets
  }

  get autoSearch(): boolean {
    const storedAutoSearch = localStorage.getItem("autoSearch")
    if (storedAutoSearch) {
      try {
        return JSON.parse(storedAutoSearch)
      }
      catch (error) {
        console.log(error);
      }
    }
    return false;
  }

  set autoSearch(bool: boolean) {
    localStorage.setItem("autoSearch", JSON.stringify(bool))
  }
}
