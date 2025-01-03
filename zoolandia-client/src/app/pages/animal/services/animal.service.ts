import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private animalPath = environment.apiUrl + "/pets"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.animalPath, data);
  }
}
