import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { ProductService } from '../../Services/product.service'
import { Product } from 'src/app/interfaces/Product'
import { AlertComponent } from '../../alert/alert.component'
import { Category } from '../../interfaces/Category'
import { Section } from '../../interfaces/Section'
import { Constants } from '../../constants'

interface ServerData{ size: { min: number, max: number }, count: number }
interface Subcategory{ _id?:String, name: String }
interface Brand{ _id?:String, name: String }
interface Query{
    _id?: String
    description?: String
    sizes?: string
    minPrice?: Number
    maxPrice?: Number
    section?: String
    category?: String
    subcategory?: String
    brand?: String
}

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {

    page: number = 1
    products: Product[]
    array: any[]
    arrayMobile: any[]
    arrayPages: number[]
    serverData: ServerData
    pages: number

    filter: boolean = false
    query: Query = { description: '', section: '', category: '', subcategory: '', brand: '' }
    initialQuery: Query = {}
    @Input() sections: Section[]
    categories: Category[]
    subcategories: Subcategory[]
    @Input() brands: Brand[]

    @Output() editProduct = new EventEmitter<Product>()
    @ViewChild(AlertComponent) alert: AlertComponent

    constructor(private productServices: ProductService) { }

    ngOnInit() {
        this.getProducts()
        this.copyQuery()
    }

    copyQuery(){
        Object.entries(this.query).forEach(([k, v]) => this.initialQuery[k] = v)
    }

    buildPagination(){
        //this.page = 1
        //this.pages = Math.ceil(this.testCount / Constants.pageSize)
        this.pages = Math.ceil(this.serverData.count / Constants.pageSize)
        this.arrayPages = new Array(this.pages > 5? 5: this.pages)
        let start = this.page+this.arrayPages.length-1 > this.pages? this.pages-this.arrayPages.length+1: this.page
        start = start > this.page-2? this.page-2:start
        start = start < 1? 1: start
        for (let i = 0; i < this.arrayPages.length; i++) {
            this.arrayPages[i] = i+start
        }
    }

    fillCategories(){
        let sec = this.sections.find(s => s._id == this.query.section)
        this.categories = sec? sec.category: undefined
        delete this.query.category
        this.subcategories = undefined
        delete this.query.subcategory
        if (this.query.section == 't') delete this.query.section
    }

    fillSubcategories(){
        let cat = this.categories.find(c => c._id == this.query.category)
        this.subcategories = cat? cat.subcategory: undefined
        delete this.query.subcategory
        if (this.query.category == 't') delete this.query.category
    }

    subcategoryChange(){
        if (this.query.subcategory == 't') delete this.query.subcategory
    }

    brandChange(){
        if (this.query.brand == 't') delete this.query.brand
    }

    getArray(){
        this.array = new Array(Math.ceil(this.products.length/3))
        this.arrayMobile = new Array(Math.ceil(this.products.length/2))
    }

    clear(){
        this.query.description = ''
        this.query.category = ''
        this.query.subcategory = ''
        this.query.brand = ''
    }

    productDetail(product: Product){
        this.alert.showAlert(
                product.description,
`<code class="is-family-monospace has-background-white">${product.ref?'<strong>Referencia:</strong>    '+product.ref+'\n':''}<strong>Sección:</strong>       ${product.sectionName}
<strong>Categoría:</strong>     ${product.categoryName}
<strong>Subcategoría:</strong>  ${product.subcategoryName}
<strong>Marca:</strong>         ${product.brandName}
<strong>Costo:</strong>         $${product.cost.toLocaleString('COP')}
<strong>Precio:</strong>        $${product.price.toLocaleString('COP')}
<strong>Tallas:</strong>        ${product.size}</code>`
            )
    }

    getProducts(newPage?: boolean){
        //if (this.filter) this.page = 1
        if (newPage) {this.query = undefined;this.query = this.initialQuery}
        else this.page = 1
        this.productServices.getData(this.query).subscribe(res => {
            this.serverData = <ServerData>res
            this.buildPagination()
        })
        this.productServices.getProducts(
                this.page,
                this.query
            ).subscribe(res => {
            this.products = res
            if (this.filter) this.filter = false
            console.log(res)
            this.getArray()
            this.copyQuery()
        })
    }

    edit(product: Product){
        this.editProduct.next(product)
    }

    deleteProduct(product: Product){
        this.alert.showAlert(`Eliminar producto`, `¿Seguro desea eliminar '${product.description}'?`, (next) => {
            this.productServices.deleteProduct(product._id).subscribe(res =>{
                if(res == 'ok') {this.alert.showAlert('Producto', 'Se ha eliminado el producto seleccionado.');this.getProducts()}
                else this.alert.showAlert('Error', 'Se produjo un error al eliminar el producto.')
            })
            next()
        })
    }

    categoryChanged(){
        let cat = this.getCategory(this.query.category)
        if (cat == undefined) {
            this.subcategories = undefined
            this.query.subcategory = ''
            return
        }
        this.subcategories = cat.subcategory
        this.query.subcategory = ''
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

}
