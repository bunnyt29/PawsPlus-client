import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private filePath = environment.apiUrl + '/files';

  constructor(
    private http: HttpClient
  ) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>(this.filePath + '/' + 'uploadImage', formData,
    {
      headers: { 'X-Skip-Loader': 'true' }
    });
  }
}
