import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { ProductService } from '../../Services/product.service'
import { Product } from 'src/app/interfaces/Product'
import { AlertComponent } from '../../alert/alert.component'
import { Category } from '../../interfaces/Category'

interface Subcategory{ _id?:String, name: String }
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

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {

    page: Number = 1
    products: Product[]

    filter: boolean = false
    query: Query = { description: '', category: '', subcategory: '', brand: '' }
    @Input() categories: Category[]
    subcategories: Subcategory[]
    @Input() brands: Brand[]

    @Output() editProduct = new EventEmitter<Product>()
    @ViewChild(AlertComponent) alert: AlertComponent

    constructor(private productServices: ProductService) { }

    ngOnInit() {
        this.getProducts()
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
                `Referencia: ${product.ref}
                Tallas: ${product.size}
                Costo: $${product.cost.toLocaleString('COP')}
                Precio: $${product.price.toLocaleString('COP')}
                Categoría: ${product.category.name}
                Subcategoría: ${product.subcategory.name}
                Marca: ${product.brand.name}`
            )
    }

    getProducts(){
        if (this.filter) this.page = 1
        this.productServices.getProducts(
                this.page,
                this.query
            ).subscribe(res => {
            this.products = res
            if (this.filter) this.filter = false
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
