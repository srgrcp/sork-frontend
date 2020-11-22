import { Component, OnInit, ViewChild } from '@angular/core'
import { Order, States } from '../interfaces/Cart'
import { ProductService } from '../Services/product.service'
import { AlertComponent } from 'src/app/alert/alert.component'
import { Constants } from '../Constants';

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
    @ViewChild(AlertComponent) alert: AlertComponent
    shortid: string = ''

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.getOrders()
    }

    addOrder(){
        this.productService.getOrders(this.page, { shortid: this.shortid }).subscribe(res => {
            if (res.length != 0) {
                console.log(res)
                if (this.orders_id.includes(res[0]._id)) return
                this.orders_id = this.orders_id != undefined?
                [ res[0]._id, ...this.orders_id ]: this.orders_id = [res[0]._id]
                this.orders = [ ...res, ...this.orders ]
                localStorage.setItem('orders', JSON.stringify(this.orders_id))
                this.shortid = ''
                //window.location.reload()
            }
        })
    }

    getOrders(){
        if (this.orders_id == undefined) this.orders_id = []
        this.productService.getOrders(this.page, { _id: { '$in': this.orders_id } }).subscribe(res => {
            this.orders = res
        })
    }

    cancelOrder(order: Order) {
        this.alert.showAlert('Cancelar Pedido', '¿Seguro desea cancelar este pedido? ref '+order.shortid, next => {
            this.productService.cancelOrder(order).subscribe(res => {
                if (res == 'ok') {this.getOrders();next()}
                else {
                    next()
                    this.alert.showAlert('Error', 'Ocurrió un error inesperado, por favor ponerse en contacto con el equipo de '+Constants.title+
                    ', si el pedido a continuación le aparece como \'Cancelado\' ignorar este mensaje.')
                    this.getOrders()
                }
            })
        })
    }

}
