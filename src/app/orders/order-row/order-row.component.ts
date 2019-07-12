import { Component, OnInit, Input } from '@angular/core'
import { Order, States } from 'src/app/interfaces/Cart'

@Component({
    selector: 'app-order-row',
    templateUrl: './order-row.component.html',
    styleUrls: ['./order-row.component.sass']
})
export class OrderRowComponent implements OnInit {

    @Input() order: Order
    states = States

    constructor() { }

    ngOnInit() {
    }

}
