import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { ProductService } from '../Services/product.service'
import { Product } from '../interfaces/Product'
import { Constants } from '../constants'
import { Title } from '@angular/platform-browser'
import { Section } from '../interfaces/Section'
import { Cart, Item } from '../interfaces/Cart'

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.sass']
})
export class ProductPageComponent implements OnInit {

    sections: Section[] = []
    brands: Brand[] = []
    array: any[]
    arrayMobile: any[]
    
    _id: String
    product: Product
    loaded: boolean = false
    title: String
    url: string
    products: Product[] = []
    size: string = ''

    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        private productService: ProductService,
        private router: Router
    ) { }

    ngOnInit() {
        this.url = this.router.url.split('#')[0]
        this.route.paramMap.subscribe((param: Params) => {
            let p = param.params
            let split = p.productURL.split('-')
            this._id = split[split.length-1]
            this.getProduct()
        })
    }

    addCartItem(){
        if (this.size == '') return
        this.productService.addCartItem({ product: this.product, size: this.size })
    }

    getArray(){
        this.array = new Array(Math.ceil(this.products.length/3))
        this.arrayMobile = new Array(Math.ceil(this.products.length/2))
    }

    getProduct(){
        this.loaded = false
        this.productService.getProduct(this._id).subscribe(prod => {
            this.url = this.router.url.split('#')[0]
            this.product = prod
            this.title = Constants.title
            this.titleService.setTitle(`${Constants.title} - ${this.product.description}`)
            this.loaded = true
            this.getProducts()
        })
    }

    getProducts(){
        this.productService.getProducts(1, { description:
            `${this.product.description} ${this.product.brandName} ${this.product.sectionName} ${this.product.categoryName} ${this.product.subcategoryName}` })
            .subscribe(res => {
                this.products = res.slice(1, 23)
                this.getArray()
            })
    }

    getURL(product: Product){
        let description = product.description
        if (description.length > 50) description = description.substr(0, 50)
        description = description.replace(/ /g, '-')
        return `${description}-${product._id}`
    }

}
