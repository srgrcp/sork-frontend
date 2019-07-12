import { Component, OnInit } from '@angular/core'
import { Order, States } from '../interfaces/Cart'
import { ProductService } from '../Services/product.service'

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.sass']
})
export class OrdersComponent implements OnInit {

    sections; brands
    orders_id: string[] = JSON.parse(localStorage.getItem('orders'))
    orders: Order[] = []
    states = States
    page = 1

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getOrders(this.page, { _id: { '$in': this.orders_id } }).subscribe(res => {
            this.orders = res
        })
    }

}
