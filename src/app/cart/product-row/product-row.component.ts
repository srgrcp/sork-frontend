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
    max: number = Constants.max_product_per_client

    constructor(
        private productService: ProductService
    ) { }

    ngOnInit() {
        if(this.index==0) console.log(this.item)
    }

    getImage(){
        if(this.index==0) console.log('GetImage', this.item, this.item.product.image[0].url)
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

}
