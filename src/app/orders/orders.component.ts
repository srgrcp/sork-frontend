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

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.getOrders()
    }

    getOrders(){
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
