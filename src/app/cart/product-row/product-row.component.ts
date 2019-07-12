import { Component, OnInit, Input } from '@angular/core'
import { Item } from 'src/app/interfaces/Cart'
import { ProductService } from 'src/app/Services/product.service'
import { Constants } from 'src/app/Constants'

@Component({
  selector: 'app-product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.sass']
})
export class ProductRowComponent implements OnInit {

    @Input() item: Item
    @Input() index: number
    @Input() admin: boolean
    @Input() order: boolean
    max: number = Constants.max_product_per_client

    constructor(
        private productService: ProductService
    ) { }

    ngOnInit() { }

    getImage(){
        var url: string
        if (this.item.variant != undefined) {
            url = this.item.product.image.find(im => im.variant == this.item.variant).url
            if (url == undefined || url == '') url = this.item.product.image[0].url
        }
        else{
            url = this.item.product.image[0].url
        }
        return url.toLowerCase().startsWith('http')? url: `${Constants.url}/images/${url}`
    }

    delete(){
        this.productService.removeCartItem(this.index)
    }

    update(){
        this.productService.updateCartItem(this.item, this.index)
    }

    getURL(product: any){
        let description = product.description
        if (description.length > 50) description = description.substr(0, 50)
        description = description.replace(/ /g, '-')
        return `${description}-${product._id}`
    }

}
