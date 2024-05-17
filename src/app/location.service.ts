import { Injectable } from '@angular/core';

interface location {
  latitude: number
  longtitude: number
}
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  setCurrentLocation() {
    navigator.geolocation.getCurrentPosition((pos) => localStorage.setItem("coords", JSON.stringify({ "latitude": pos.coords.latitude, "longitude": pos.coords.longitude })), (error) => console.log(error))
  }

  get currentLocation(): location | null {
    const coordsString = localStorage.getItem("coords")
    if (coordsString) {
      try {
        const coords = JSON.parse(coordsString)
        return coords as location
      } catch (error) {
        return null
      }
    }
    return null
  }


}
