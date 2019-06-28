import { Component, OnInit, Input } from '@angular/core'
import { Product } from '../interfaces/Product'

@Component({
    selector: 'app-product-tile',
    templateUrl: './product-tile.component.html',
    styleUrls: ['./product-tile.component.sass']
})
export class ProductTileComponent implements OnInit {

    @Input() product: Product

    constructor() { }

    ngOnInit() {
    }

    getURL(){
        let description = this.product.description
        if (description.length > 50) description = description.substr(0, 50)
        description = description.replace(/ /g, '-')
        return `${description}-${this.product._id}`
    }

}
