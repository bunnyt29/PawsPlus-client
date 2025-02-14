import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private petPath = environment.apiUrl + "/pets";
  private breedPath = environment.apiUrl + "/breeds";
  private userPath = environment.apiUrl + "/profiles";
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.petPath, data);
  }

  get(id: string | null):Observable<any> {
    return this.http.get<any>(this.userPath + "/" + id + "/myPet" );
  }

  edit(id:string, data:any){
    return this.http.put(this.petPath + '/' + id, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.petPath + '/' + id);
  }

  getBreeds(petType: number): Observable<any> {
    const httpParams = new HttpParams().set('petType', petType);

    return this.http.get<any>(this.breedPath, { params: httpParams });
  }
}
