import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private petPath = environment.apiUrl + "/pets"
  private userPath = environment.apiUrl + "/profiles"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.petPath, data);
  }

  get(id: string):Observable<any> {
    return this.http.get<any>(this.userPath + "/" + id + "/pet" );
  }
}
