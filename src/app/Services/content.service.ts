import { Injectable } from '@angular/core'
import { Constants } from '../Constants'
import { UserService } from './auth.service'
import { Product } from '../interfaces/Product'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class ContentService {

    constructor(private http: HttpClient) { }

    API_URI = Constants.API_URI

    createSlide(file: File, url: string, description: string):Observable<string>{
        let formData: FormData = new FormData()
        formData.append('image', file)
        formData.append('url', url)
        formData.append('description', description)
        let headers = { headers: new HttpHeaders().set('Authorization',  `Basic ${UserService.token}`) }
        return this.http.post<string>(`${this.API_URI}/store/create-slide`, formData, headers)
    }

}
