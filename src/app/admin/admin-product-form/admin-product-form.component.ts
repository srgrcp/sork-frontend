import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { Product } from '../../interfaces/Product'
import { Section } from '../../interfaces/Section'
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
        section: '',
        category: '',
        subcategory: '',
        brand: ''
    }

    slideURL: Slide = { url: '' }
    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() updateProducts = new EventEmitter()
    @Input() brands: Brand[]
    @Input() sections: Section[]
    categories: Category[]
    subcategories: Subcategory[]
    slide: boolean = false
    edit: boolean = false
    loading: boolean = false

    constructor(
        private categoryServices: CategoryBrandService,
        private productServices: ProductService
        ) { }
    
    submit(){
        this.loading = true
        /*this.product.section = this.getSection(this.section)
        this.product.category = this.getCategory(this.category)//{ _id: this.category }
        this.product.subcategory = this.getSubcategory(this.subcategory) //{ _id: this.subcategory }
        this.product.brand = this.getBrand(this.brand) //{ _id: this.brand }*/
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
        console.log('productsection', product)
        console.log('sections', this.sections)
        this.categories = this.getSection(product.section).category
        this.subcategories = this.getCategory(product.category).subcategory
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
            section: '',
            category: '',
            subcategory: '',
            brand: ''
        }
        this.slide = false
        this.slideURL = { url: '' }
        //this.refreshCategories()
        this.categories = undefined
        this.subcategories = undefined
    }

    getSection(_id: String){
        return this.sections.find(s => s._id == _id)
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

    getSubcategory(_id: String){
        return this.subcategories.find(s => s._id == _id)
    }

    getBrand(_id: String){
        return this.brands.find(b => b._id == _id)
    }

    sectionChanged(modified?: boolean){
        if (modified){
            this.subcategories = undefined
            this.categories = undefined
            this.product.subcategory = ''
            this.product.category = ''
            this.product.section = ''
        }
        let sec = this.getSection(this.product.section)
        if(sec == undefined){
            this.categories = undefined
            this.subcategories = undefined
            this.product.subcategory = ''
            this.product.category = ''
            return
        }
        this.product.sectionName = sec.name
        this.categories = sec.category
        this.product.category = ''
        this.subcategories = undefined
        this.product.subcategory = ''
    }

    categoryChanged(){
        let cat = this.getCategory(this.product.category)
        if (cat == undefined){
            this.subcategories = undefined
            this.product.subcategory = ''
            this.product.category = ''
            return
        }
        this.product.categoryName = cat.name
        this.subcategories = cat.subcategory
        this.product.subcategory = ''
    }

    subcategoryChanged(){
        if (this.product.subcategory != undefined && this.product.subcategory != ''){
            let sub = this.getSubcategory(this.product.subcategory)
            this.product.subcategoryName = sub.name
        }
    }

    brandChanged(){
        if (this.product.brand != undefined && this.product.brand != ''){
            let br = this.getBrand(this.product.brand)
            this.product.brandName = br.name
        }
    }

    /*refreshCategories(){
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
    }*/

    validateForm(){
        return this.product.section == undefined || this.product.section == '' ||
            this.product.subcategory == undefined || this.product.subcategory == '' ||
            this.product.category == undefined || this.product.category == '' ||
            this.product.brand == undefined || this.product.brand == ''
    }

    ngOnInit() {
        
    }

    test(){
        console.log(this.categories[0])
    }

}
