import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core'
import { ProductService } from '../Services/product.service'
import { Cart, Item } from '../interfaces/Cart';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit, OnDestroy {

    sections; brands
    cart: Cart
    items: Item[] = []

    tabPayu: boolean = false

    constructor(
        private productService: ProductService,
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.renderer.addClass(document.body, 'has-background-light')
        this.productService.getCart().subscribe(res => {
            this.cart = res
            this.items = res.items
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'has-background-light')
    }

    getTotal(){
        let total: number = 0
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            total += item.product.price*item.quantity
        }
        return total
    }

}
