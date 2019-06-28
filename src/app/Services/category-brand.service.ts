import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Category } from '../interfaces/Category'
import { Constants } from '../constants'
import { UserService } from './auth.service'

interface Id { _id: string }
interface Brand{ _id?:String, name: String }

@Injectable({
    providedIn: 'root'
})
export class CategoryBrandService {

    constructor(private http: HttpClient) { }

    API_URI = Constants.API_URI

    getCategories():Observable<Category[]>{
        return this.http.get<Category[]>(`${this.API_URI}/store/categories`)
    }

    createCategory(name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/create-category`, { token: UserService.token, name })
    }

    updateCategory(_id: String, name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/update-category`, { token: UserService.token, _id, name })
    }

    deleteCategory(_id: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/delete-category`, { token: UserService.token, _id })
    }

    createSubcategory(cat: String, name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/create-subcategory`, { token: UserService.token, cat, name })
    }

    updateSubcategory(cat: String, _id: String, name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/update-subcategory`, { token: UserService.token, cat, _id, name })
    }

    deleteSubcategory(cat: String, _id: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/delete-subcategory`, { token: UserService.token, cat, _id })
    }

    getBrands():Observable<Brand[]>{
        return this.http.get<Brand[]>(`${this.API_URI}/store/brands`)
    }

    createBrand(name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/create-brand`, { token: UserService.token, name })
    }

    updateBrand(_id: String, name: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/update-brand`, { token: UserService.token, _id, name })
    }

    deleteBrand(_id: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/delete-brand`, { token: UserService.token, _id })
    }

}
