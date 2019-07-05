import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Product } from '../interfaces/Product'
import { Constants } from '../constants'
import { UserService } from './auth.service'
import { Cart, Item } from '../interfaces/Cart';

interface Id { _id: string }
interface Slide{ _id: String, url: String, product: { _id: String, description: String } }

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    API_URI = Constants.API_URI

    cart: Cart = JSON.parse(localStorage.getItem('cart'))
    listeners: Function[] = []

    getCart():Observable<Cart>{
        return new Observable(observer => {
            observer.next(this.cart)
            this.listeners.push(() => observer.next(this.cart))
            return ()=>{}
        })
    }

    addCartItem(item: Item){
        if (!this.cart) this.cart = { items: [] }
        this.cart.items.push(item)
        localStorage.setItem('cart', JSON.stringify(this.cart))
        for (let i = 0; i < this.listeners.length; i++) this.listeners[i]()
    }

    removeCartItem(i: number){
        this.cart.items.splice(i, 1)
        localStorage.setItem('cart', JSON.stringify(this.cart))
        for (let i = 0; i < this.listeners.length; i++) this.listeners[i]()
    }
    
    getProduct(_id: String):Observable<Product>{
        return this.http.get<Product>(`${this.API_URI}/store/product/${_id}`)
    }

    getProducts(page?: Number, queryObject?: any):Observable<Product[]>{
        let query ='?'
        Object.entries(queryObject).forEach(([k, v]) => {if (v != '') query += query!='?'? `&${k}=${v}`:`${k}=${v}`})
        if (query == '?') query = ''
        console.log('queryService', query)
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

    getData(query?){
        //if (query.sizes == '') delete query.sizes
        Object.entries(query).forEach(([k, v]) => {if (v == '') delete query[k]})
        console.log('getData', query)
        return this.http.post(`${this.API_URI}/store/data`, query? { query }: {})
    }

}
