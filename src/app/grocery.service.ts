import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
export type GroceryItemData = {
  name: string,
  dollars: number,
  cents: number,
  metric: string,
  imageUrl: string
  subtitle: string
  productUrl: string
  productCode: number,
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
  grocerySearch(query: string, selectedSupermarkets: string[], order: string, category: string) {
    const url = environment.apiUrl + `/grocery-search?query=${query}&supermarket=${selectedSupermarkets}&order=${order}&category=${category}`
    return this.http.get<GrocerySearchResponse>(url).pipe(catchError(this.handleGrocerySearchError))
  }
}
