import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
export type GroceryItemData = {
  name: string,
  price: number,
  metric: string,
  imageUrl: string
  info: string
  productUrl: string
  productCode: string,
}
export interface GrocerySearchResponse {
  paknsave?: GroceryItemData[]
  countdown?: GroceryItemData[]
  newworld?: GroceryItemData[]
}
@Injectable({
  providedIn: 'root'
})
export class GroceryService {



  constructor(private http: HttpClient) { }

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
  grocerySearchv2(query: string, selectedSupermarkets: string[], order: string, category: string, latitude: number, longitude: number) {
    const url = environment.apiUrl + `/v2/grocery-search?query=${query}&supermarkets=${selectedSupermarkets}&order=${order}&category=${category}&longitude=${longitude}&latitude=${latitude}`
    return this.http.get<GrocerySearchResponse>(url).pipe(catchError(this.handleGrocerySearchError))
  }
}
