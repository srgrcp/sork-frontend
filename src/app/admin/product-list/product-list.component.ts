import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { ProductService } from '../../Services/product.service'
import { Product } from 'src/app/interfaces/Product'
import { AlertComponent } from '../../alert/alert.component'
import { Category } from '../../interfaces/Category'

interface Subcategory{ _id?:String, name: String }
interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {

    page: Number = 1
    products: Product[]

    filter: boolean = false
    description: string = ''
    ref: string = ''
    category: string = ''
    subcategory: string = ''
    brand: string = ''
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
        this.description = ''
        this.ref = ''
        this.category = ''
        this.subcategory = ''
        this.brand = ''
    }

    productDetail(product: Product){
        this.alert.showAlert(
                product.description,
                `Referencia: ${product.ref}
                Tallas: ${product.size}
                Costo: ${product.cost}
                Precio: ${product.price}
                Categoría: ${product.category.name}
                Subcategoría: ${product.subcategory.name}
                Marca: ${product.brand.name}`
            )
    }

    getProducts(){
        if (this.filter) this.page = 1
        let query: any = {}
        if (this.description != '') query.description = this.description
        if (this.ref != '') query.ref = this.ref
        if (this.category != '') query.category = this.category
        if (this.subcategory != '') query.subcategory = this.subcategory
        if (this.brand != '') query.brand = this.brand
        this.productServices.getProducts(
                this.page,
                query
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
        let cat = this.getCategory(this.category)
        if (cat == undefined) {
            this.subcategories = undefined
            this.subcategory = ''
            return
        }
        this.subcategories = cat.subcategory
        this.subcategory = ''
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

}
