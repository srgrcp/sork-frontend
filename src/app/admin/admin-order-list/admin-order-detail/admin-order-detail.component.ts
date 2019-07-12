import { Component, OnInit, Input } from '@angular/core'
import { Order, States } from 'src/app/interfaces/Cart'
import { ProductService } from 'src/app/Services/product.service'
import { toast } from 'bulma-toast'

@Component({
    selector: 'app-admin-order-detail',
    templateUrl: './admin-order-detail.component.html',
    styleUrls: ['./admin-order-detail.component.sass']
})
export class AdminOrderDetailComponent implements OnInit {

    @Input() order: Order
    states = States
    payuTable: any[]
    loading: boolean = false

    constructor(private productService: ProductService) { }

    ngOnInit() {
    }

    fillTable(){
        this.payuTable = []
        if (this.order.payu_info != undefined) Object.entries(this.order.payu_info).forEach(([k, v]) => this.payuTable.push({k,v}))
        return this.payuTable
    }

    updateOrder(){
        this.loading = true
        this.productService.updateOrder(this.order._id, this.order.state, this.order.note).subscribe(res => {
            if(res != 'ok') 
                toast({
                    message: `
                        <div class="container padding">
                            Ocurrió un error inesperado 😪.
                            <div class="buttons is-centered" style="margin-top:1rem">
                                <button type="button" class="button is-white is-rounded">Aceptar</button>
                            </div>
                        </div>
                        `,
                    position: 'center',
                    type: 'is-warning',
                    dismissible: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    animate: { in: 'fadeIn', out: 'fadeOut' }
                })
            this.loading = false
        })
    }

    test(){
        console.log(this.order.note)
    }

}
