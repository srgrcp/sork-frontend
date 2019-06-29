import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Product } from '../interfaces/Product'
import { Constants } from '../constants'
import { UserService } from './auth.service'

interface Id { _id: string }
interface Slide{ _id: String, url: String, product: { _id: String, description: String } }

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    API_URI = Constants.API_URI

    /*getProducts(
            page?: Number,
            description?: string,
            ref?: string,
            category?: string,
            subcategory?: string,
            brand?: string
        ):Observable<Product[]>{
        let query ='?'
        if (description != undefined && description != '') query += `description=${description}`
        if (ref != undefined && ref != '') query += query!='?'? `&ref=${ref}`:`ref=${ref}`
        if (category != undefined && category != '') query += query!='?'? `&category=${category}`:`category=${category}`
        if (subcategory != undefined && subcategory != '') query += query!='?'? `&subcategory=${subcategory}`:`subcategory=${subcategory}`
        if (brand != undefined && brand != '') query += query!='?'? `&brand=${brand}`:`brand=${brand}`
        if (query == '?') query = ''
        if (page) return this.http.get<Product[]>(`${this.API_URI}/store/products/${page}${query}`)
        return this.http.get<Product[]>(`${this.API_URI}/store/products${query}`)
        }*/

    getProducts(page?: Number, queryObject?: any):Observable<Product[]>{
        let query ='?'
        Object.entries(queryObject).forEach(([k, v]) => {if (v != '') query += query!='?'? `&${k}=${v}`:`${k}=${v}`})
        if (query == '?') query = ''
        if (page) return this.http.get<Product[]>(`${this.API_URI}/store/products/${page}${query}`)
        return this.http.get<Product[]>(`${this.API_URI}/store/products${query}`)
    }

    createProduct(product: Product):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/create-product`, { token: UserService.token, product })
    }

    deleteProduct(_id: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/delete-product`, { token: UserService.token, _id })
    }

    updateProduct(product: Product):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/update-product`, { token: UserService.token, product })
    }

    getSlides():Observable<Slide[]>{
        return this.http.get<Slide[]>(`${this.API_URI}/store/slides`)
    }

    getData(){
        return this.http.get(`${this.API_URI}/store/data`)
    }

}
