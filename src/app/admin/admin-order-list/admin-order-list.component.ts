import { Component, OnInit, ViewChild } from '@angular/core'
import { ProductService } from 'src/app/Services/product.service'
import { Order, States } from 'src/app/interfaces/Cart'
import { AdminOrderDetailComponent } from './admin-order-detail/admin-order-detail.component'

@Component({
    selector: 'app-admin-order-list',
    templateUrl: './admin-order-list.component.html',
    styleUrls: ['./admin-order-list.component.sass']
})
export class AdminOrderListComponent implements OnInit {

    page: number = 1
    orders: Order[] = []
    sorttoggle: any = {}
    states = States
    @ViewChild(AdminOrderDetailComponent) orderDetail: AdminOrderDetailComponent

    windowIndex: number = 0

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getOrders(this.page).subscribe(res => this.orders = res)
    }

    sort(key: string, key2?: string){
        if (key2 != undefined){
            this.sorttoggle[key2] = this.sorttoggle[key2] == undefined? 1: this.sorttoggle[key2] * -1
            this.orders.sort((a, b) =>
                a[key][key2].toString().toLowerCase()>b[key][key2].toString().toLowerCase()? this.sorttoggle[key2]:
                a[key][key2].toString().toLowerCase()<b[key][key2].toString().toLowerCase()?-this.sorttoggle[key2]:0
            )
        }
        else{
            this.sorttoggle[key] = this.sorttoggle[key] == undefined? 1: this.sorttoggle[key] * -1
            this.orders.sort((a, b) =>
                a[key].toString().toLowerCase()>b[key].toString().toLowerCase()? this.sorttoggle[key]:
                a[key].toString().toLowerCase()<b[key].toString().toLowerCase()?-this.sorttoggle[key]:0
            )
        }
    }

}
