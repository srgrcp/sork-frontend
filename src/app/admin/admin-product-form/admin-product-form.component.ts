import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { Product } from '../../interfaces/Product'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { ProductService } from '../../Services/product.service'
import { AlertComponent } from '../../alert/alert.component'

interface Subcategory{ _id?: String, name: String }
interface Brand{ _id?: String, name: String }
interface Slide{ _id?: String, url?: String }

@Component({
    selector: 'app-admin-product-form',
    templateUrl: './admin-product-form.component.html',
    styleUrls: ['./admin-product-form.component.sass']
})
export class AdminProductFormComponent implements OnInit {

    product: Product = {
        description: '',
        ref: '',
        size: '',
        cost: 0,
        price: 0,
        image: '',
        category: { name: '' },
        subcategory: { name: '' },
        brand: { name: '' }
    }

    slideURL: Slide = { url: '' }
    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() updateProducts = new EventEmitter()
    @Input() brands: Brand[]
    @Input() categories: Category[]
    subcategories: Subcategory[]
    brand: String = ''
    category: String = ''
    slide: boolean = false
    subcategory: String = ''
    edit: boolean = false
    loading: boolean = false

    constructor(
        private categoryServices: CategoryBrandService,
        private productServices: ProductService
        ) { }
    
    submit(){
        this.loading = true
        this.product.category = { _id: this.category }
        this.product.subcategory = { _id: this.subcategory }
        this.product.brand = { _id: this.brand }
        if (this.slide) this.product.slide = this.slideURL
        if(this.edit){
            this.productServices.updateProduct(this.product).subscribe(res =>{
                if (res.split('::')[0] == 'ok'){
                    this.updateProducts.next()
                    this.alert.showAlert('Producto', 'El producto se modificó correctamente.')
                    this.cancelEdit()
                }else{
                    this.alert.showAlert('Error al modificar producto', res)
                }
                this.loading = false
            })
        }else{
            this.productServices.createProduct(this.product).subscribe(res => {
                if (res.split('::')[0] == 'ok'){
                    this.updateProducts.next()
                    this.alert.showAlert('Producto', 'El producto se agregó correctamente.')
                    this.cancelEdit()
                }else{
                    this.alert.showAlert('Error al crear producto', res)
                }
                this.loading = false
            })
        }
    }

    editProduct(product: Product){
        this.edit = true
        this.product = product
        this.category = product.category._id
        this.subcategories = this.getCategory(product.category._id).subcategory
        this.subcategory = product.subcategory._id
        this.brand = product.brand._id
        if (product.slide) {
            this.slide = true
            this.slideURL = product.slide
        }else{
            this.slide = false
            this.slideURL = { url: '' }
        }
    }

    cancelEdit(){
        this.edit = false
        this.product = {
            description: '',
            ref: '',
            size: '',
            cost: 0,
            price: 0,
            image: '',
            category: { name: '' },
            subcategory: { name: '' },
            brand: { name: '' }
        }
        this.slide = false
        this.slideURL = { url: '' }
        this.refreshCategories()
        this.category = ''
        this.subcategory = ''
        this.brand = ''
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

    getSubcategory(category: Category, _id: String){
        return category.subcategory.find(s => s._id == _id)
    }

    getBrand(_id: String){
        return this.brands.find(b => b._id == _id)
    }

    categoryChanged(modified?: boolean){
        if (modified){
            this.subcategories = undefined
            this.product.subcategory = { name: '' }
            this.product.category = { name: '' }
            this.category = ''
            this.subcategory = ''
        }
        let cat = this.getCategory(this.category)
        if (cat == undefined){
            this.subcategories = undefined
            this.product.subcategory = { name: '' }
            this.product.category = { name: '' }
            this.category = ''
            this.subcategory = ''
            return
        }
        this.subcategories = cat.subcategory
        this.subcategory = ''
        this.product.category = { _id: cat._id, name: cat.name }
    }

    subcategoryChanged(){
        if (this.subcategory != undefined && this.subcategory != ''){
            let sub = this.getSubcategory(this.getCategory(this.category), this.subcategory)
            this.product.subcategory = { _id: sub._id, name: sub.name }
        }else this.product.subcategory = { name: '' }
    }

    brandChanged(){
        if (this.brand != undefined && this.brand != ''){
            let br = this.getBrand(this.brand)
            this.product.brand = br
        }else this.product.brand = { name: '' }
    }

    refreshCategories(){
        if (this.categories[0] != undefined){
            this.category = this.categories[0]._id
            this.subcategories = this.categories[0].subcategory
            if (this.subcategories[0] != undefined) this.subcategory = this.subcategories[0]._id
            else this.subcategory = ''
        }
        else {
            this.category = ''
            this.subcategory = ''
            this.subcategories = undefined
        }
    }

    validateForm(){
        return this.subcategory == undefined || this.subcategory == '' || this.category == undefined || this.category == '' || this.brand == undefined || this.brand == ''
    }

    ngOnInit() { }

    test(){
        console.log(this.categories[0])
    }

}
