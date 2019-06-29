import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { ProductService } from '../Services/product.service'
import { Category } from '../interfaces/Category'
import { Product } from '../interfaces/Product'
import { Constants } from '../constants'
import { Title } from '@angular/platform-browser'

interface Brand{ _id?:String, name: String }
interface Query{
    _id?: String
    description?: String
    sizes?: string
    minPrice?: Number
    maxPrice?: Number
    category?: String
    subcategory?: String
    brand?: String
}
interface ServerData{ size: { min: number, max: number }, count: Number }

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

    categoryName: String
    subcategoryName: String
    brandName: String
    state: String[] = []
    categories: Category[]
    brands: Brand[]
    products: Product[]
    page: Number = 1
    query: Query = { description: '' }
    loaded: boolean = false
    title: String = Constants.title
    array: any[]
    arrayMobile: any[]
    arraySizes: boolean[]
    serverData: ServerData
    sizes: number[] = []
    filter: boolean = false

    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        private productService: ProductService,
        private router: Router
    ) { }

    ngOnInit() {
        this.productService.getData().subscribe(res => {
            this.serverData = <ServerData>res
            this.arraySizes = new Array(this.serverData.size.max-this.serverData.size.min+1)
            for (let i = 0; i < this.arraySizes.length; i++)
                this.arraySizes[i] = false
        })
        this.query.description = ''
        this.route.data.subscribe(d => {
            console.log(d)
            if(d.query) this.query.description = d.query
            this.router.config.find(r => r.path === 'Catalogo').data = undefined
        })
        this.route.paramMap.subscribe((p: Params) => {
            let params = p.params
            this.categoryName = params.category
            this.subcategoryName = params.subcategory
            this.brandName = params.brand
            this.whatIs()
            this.titleService.setTitle(`${Constants.title} - ${this.getState()}`)
            if(this.loaded) {
                this.initQuery()
                this.getProducts()
            }
        })
    }

    sizeCheck(n: number){
        if (!this.sizes.includes(n)) this.sizes.push(n)
        else this.sizes.splice(this.sizes.indexOf(n), 1)
        console.log(this.sizes)
        this.query.sizes = ''
        for (let i = 0; i < this.sizes.length; i++)
            this.query.sizes += i==this.sizes.length-1? this.sizes[i]: this.sizes[i]+','
    }

    getArray(){
        this.array = new Array(Math.ceil(this.products.length/3))
        this.arrayMobile = new Array(Math.ceil(this.products.length/2))
    }

    whatIs(){
        this.state.push('catalog')
        if (this.categoryName) {
            this.state.push('category')
        }
        if (this.subcategoryName) {
            this.state.push('subcategory')
        }
        if (this.brandName) {
            this.state.push('brand')
        }
    }

    initQuery(){
        if (this.state.includes('subcategory'))
            this.getSubcategoryID()
        if (this.state.includes('category') && !this.state.includes('subcategory'))
            this.getCategoryId()
        if (this.state.includes('brand'))
            this.getBrandId()
    }

    getCategoryId(){
        this.query.category = this.categories.find(c => c.name == this.categoryName)._id
    }

    getSubcategoryID(){
        let cat = this.categories.find(c => c.name == this.categoryName)
        this.query.category = cat._id
        this.query.subcategory = cat.subcategory.find(s => s.name == this.subcategoryName)._id
    }

    getBrandId(){
        this.query.brand = this.brands.find(b => b.name == this.brandName)._id
    }

    getCategories(categories: Category[]){
        this.categories = categories
        if (this.brands) {
            this.initQuery()
            this.getProducts()
        }
    }

    getBrands(brands: Brand[]){
        this.brands = brands
        if (this.categories) {
            this.initQuery()
            this.getProducts()
        }
    }

    getProducts(query?: String){
        /*Object.entries(this.query).forEach(([k, v]) => {
            if (v === '') delete this.query[k]
        })*/
        if (query) {
            this.query.description = query
            this.router.config.find(r => r.path === 'Catalogo').data = undefined
        }
        console.log(this.query)
        this.productService.getProducts(this.page, this.query).subscribe(res => {
            this.products = res
            this.getArray()
            this.loaded = true
        })
    }

    getState(){
        switch (this.state[this.state.length-1]) {
            case 'catalog':
                return 'Catálogo'
            case 'category':
                return this.categoryName
            case 'subcategory':
                return this.subcategoryName
            case 'brand':
                return this.brandName
        }
    }

    test(e){
        console.log(e)
    }

}
