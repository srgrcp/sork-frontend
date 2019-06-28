import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { ProductService } from '../Services/product.service'
import { Category } from '../interfaces/Category'
import { Product } from '../interfaces/Product'
import { Constants } from '../constants'
import { switchMap } from 'rxjs/operators'

interface Brand{ _id?:String, name: String }
interface Query{
    _id?: String
    description?: String
    ref?: String
    size?: String
    cost?: Number
    price?: Number
    category?: String
    subcategory?: String
    brand?: String
}

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit {

    categoryName: String
    subcategoryName: String
    brandName: String
    state: String
    categories: Category[]
    brands: Brand[]
    products: Product[]
    page: Number = 1
    query: Query = {}
    loaded: boolean = false
    title: String = Constants.title
    array: any[]
    arrayMobile: any[]

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService
    ) { }

    ngOnInit() {
        //let params = this.route.snapshot.params
        this.route.paramMap.subscribe((p: Params) => {
            let params = p.params
            this.categoryName = params.category
            this.subcategoryName = params.subcategory
            this.brandName = params.brand
            this.whatIs()
            if(this.loaded) {
                this.initQuery()
                this.getProducts()
            }
        })
    }

    getArray(){
        this.array = new Array(Math.ceil(this.products.length/3))
        this.arrayMobile = new Array(Math.ceil(this.products.length/2))
    }

    whatIs(){
        if (this.subcategoryName) {
            this.state = 'subcategory'
            return
        }
        if (this.categoryName) {
            this.state = 'category'
            return
        }
        if (this.brandName) {
            this.state = 'brand'
            return
        }
        this.state = 'catalog'
    }

    initQuery(){
        switch (this.state) {
            case 'subcategory':
                this.getSubcategoryID()
            break
            case 'category':
                this.getCategoryId()
            break
            case 'brand':
                this.getBrandId()
            break
        }
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

    getProducts(){
        this.productService.getProducts(this.page, this.query).subscribe(res => {
            this.products = res
            this.getArray()
            this.loaded = true
        })
    }

}
