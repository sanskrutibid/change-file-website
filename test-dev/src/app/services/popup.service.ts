import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  private apiUrl = `${environment.backendUrl}/popup-images`;

  constructor(private http: HttpClient) {}

  getPopupImages() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
