import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { ProductService } from '../Services/product.service'
import { Product } from '../interfaces/Product'
import { Constants } from '../Constants'
import { Title } from '@angular/platform-browser'
import { Section } from '../interfaces/Section'
import { AlertComponent } from '../alert/alert.component'
import { toast } from 'bulma-toast'
import { Cart, Item } from '../interfaces/Cart'

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.sass']
})
export class ProductPageComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent

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
    i: number = 0
    variants: string[] = []
    variant: string = ''
    quantity: number = 1
    max: number = Constants.max_product_per_client

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

    addCartItem(buyNow?: boolean){
        if (this.size == '') {
            toast({
                message: `Debe seleccionar una talla.`,
                position: 'bottom-center',
                type: 'is-primary',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return
        }
        if (this.variants.length != 0 && this.variant == ''){
            toast({
                message: `Debe seleccionar una variante.`,
                position: 'bottom-center',
                type: 'is-primary',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return
        }
        this.quantity = Math.floor(this.quantity)
        this.quantity = this.quantity < 1? 1: this.quantity > this.max? this.max: this.quantity
        if (this.variant == '') this.productService.addCartItem({ product: this.product, size: this.size, quantity: this.quantity })
        else this.productService.addCartItem({ product: this.product, size: this.size, variant: this.variant, quantity: this.quantity })
        toast({
            message: `
            <div class="container padding">
                ¡Se ha agregado ${this.product.description} al carrito!.
                <div class="buttons is-centered" style="margin-top:1rem">
                    <a routerLink="/Carrito" ng-reflect-router-link="/Carrito" href="/Carrito" type="button" class="button is-white is-rounded">Ir al carrito</a>
                </div>
            </div>
            `,
            position: 'center',
            type: 'is-primary',
            pauseOnHover: true,
            closeOnClick: false,
            dismissible: true,
            animate: { in: 'fadeIn', out: 'fadeOut' }
        })
        this.size = ''
        this.variant = ''
        if (buyNow) this.router.navigate(['/Carrito'])
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
            this.variants = this.product.image.filter(im => im.variant != undefined).map(im => im.variant)
            this.getProducts()
        })
    }

    getProducts(){
        console.log(this.product.image.map(i => i.color).join(' '))
        this.productService.getProducts(1, { description:
            `${this.product.description} ${this.product.brandName} ${this.product.sectionName} ${this.product.categoryName} ${this.product.subcategoryName} ${this.product.image.map(i => i.color).join(' ')}` })
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

    getImage(url: String){
        return url.toLowerCase().startsWith('http')? url: `${Constants.url}/images/${url}`
    }

    getStyle(i: number){
        return {
            'background': 'url('+this.getImage(this.product.image[i].url)+')',
            'background-position': 'center/*'+i+'*/',
            'background-size': 'cover/*'+i+'*/'
        }
    }

}
