import { Injectable } from '@angular/core'
import { HttpClient, HttpParams, HttpHeaders, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { Product, Slide } from '../interfaces/Product'
import { Constants } from '../Constants'
import { UserService } from './auth.service'
import { Cart, Item, Order } from '../interfaces/Cart'

interface Id { _id: string }
//interface Slide{ _id: String, url: String, product: { _id: String, description: String } }

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    constructor(private http: HttpClient) { }

    API_URI = Constants.API_URI

    cart: Cart = JSON.parse(localStorage.getItem('cart'))
    listeners: Function[] = []

    checkout(order: Order, method: number){
        return this.http.post(`${this.API_URI}/store/checkout`, { order, method })
    }

    getOrders(page: number, query?: any):Observable<Order[]>{
        return query == undefined? this.http.get<Order[]>(`${this.API_URI}/store/orders/${page}`):
            this.http.post<Order[]>(`${this.API_URI}/store/orders/${page}`, {query})
    }

    updateOrder(_id: string, state: number, note: string){
        return this.http.post(`${this.API_URI}/store/update-order`, { token: UserService.token, _id, state, note })
    }

    cancelOrder(order: Order) {
        return this.http.post(`${this.API_URI}/store/cancel-order`, { shortid: order.shortid })
    }

    getCart():Observable<Cart>{
        if (this.cart.items.length != 0) this.http.post<Product[]>(`${this.API_URI}/store/s-products`, {_ids: this.cart.items.map(i => i.product._id)}).subscribe(res => {
            for (let i = 0; i < this.cart.items.length; i++) {
                this.cart.items[i].product = res.find(p => p._id == this.cart.items[i].product._id)
            }
        })
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

    updateCartItem(item: Item, i: number){
        if (!this.cart){
            this.cart = { items: [] }
            this.cart.items.push(item)
            localStorage.setItem('cart', JSON.stringify(this.cart))
            for (let i = 0; i < this.listeners.length; i++) this.listeners[i]()
            return
        }
        this.cart.items[i] = item
        localStorage.setItem('cart', JSON.stringify(this.cart))
        for (let i = 0; i < this.listeners.length; i++) this.listeners[i]()
    }

    deleteCart(){
        this.cart = { items: [] }
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
        if (page) return this.http.get<Product[]>(`${this.API_URI}/store/products/${page}${query}`)
        return this.http.get<Product[]>(`${this.API_URI}/store/products${query}`)
    }

    topProducts():Observable<Product[]>{
        return this.http.get<Product[]>(`${this.API_URI}/store/topproducts`)
    }

    getFormData(product: Product, files: any[], slide?: File){
        const formData: FormData = new FormData()
        formData.append('data', JSON.stringify(product))
        for (let i = 0; i < files.length; i++) {
            const fl = files[i]
            if (fl.file) formData.append(fl.file.name, <File>fl.file, fl.file.name)
        }
        if (slide) formData.append('slide', slide, slide.name)
        return formData
    }

    createProduct(product: Product, images: any[], slide?: File):Observable<String>{
        let formData = this.getFormData(product, images, slide)
        let headers = { headers: new HttpHeaders().set('Authorization',  `Basic ${UserService.token}`) }
        return this.http.post<String>(`${this.API_URI}/store/create-product`, formData, headers)
    }

    deleteProduct(_id: String):Observable<String>{
        return this.http.post<String>(`${this.API_URI}/store/delete-product`, { token: UserService.token, _id })
    }

    updateProduct(product: Product, images: any[], slide?: File):Observable<String>{
        let formData = this.getFormData(product, images, slide)
        let headers = { headers: new HttpHeaders().set('Authorization',  `Basic ${UserService.token}`) }
        return this.http.post<String>(`${this.API_URI}/store/update-product`, formData, headers)
    }

    getSlides():Observable<any[]>{
        return this.http.get<any[]>(`${this.API_URI}/store/slides`)
    }

    getData(query?){
        //if (query.sizes == '') delete query.sizes
        Object.entries(query).forEach(([k, v]) => {if (v == '') delete query[k]})
        return this.http.post(`${this.API_URI}/store/data`, query? { query }: {})
    }

}
