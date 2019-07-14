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
    headers = { headers: new HttpHeaders().set('Authorization',  `Basic ${UserService.token}`) }

    createSlide(file: File, ref: string, description: string):Observable<string>{
        let formData: FormData = new FormData()
        formData.append('image', file)
        formData.append('ref', ref)
        formData.append('description', description)
        return this.http.post<string>(`${this.API_URI}/store/create-slide`, formData, this.headers)
    }

    deleteSlide(_id: string){
        return this.http.post(`${this.API_URI}/store/delete-slide`, {_id}, this.headers)
    }

}
