import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BookingsService {

  constructor(
    private http: HttpClient
  ) { }

  submitBookings(payload:any){
    return  this.http.post<any>(`${environment.baseUrl}api/users/register`, payload)
  }
}
