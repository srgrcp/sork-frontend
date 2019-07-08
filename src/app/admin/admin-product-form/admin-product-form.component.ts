import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { Product } from '../../interfaces/Product'
import { Section } from '../../interfaces/Section'
import { ProductService } from '../../Services/product.service'
import { AlertComponent } from '../../alert/alert.component'
import { Constants } from 'src/app/Constants'

interface Subcategory{ _id?: string, name: string }
interface Brand{ _id?: string, name: string }
interface Slide{ file?: File, url?: string }
interface Image{ file?: File, url: string, color?: string, variant?: string }

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
        image: [{ url:'' }],
        section: '',
        category: '',
        subcategory: '',
        brand: ''
    }
    images: Image[] = []
    slideFile: Slide = { url: '' }

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() updateProducts = new EventEmitter()
    @Input() brands: Brand[]
    @Input() sections: Section[]
    categories: Category[]
    subcategories: Subcategory[]
    colors: String[] = Constants.colors
    slide: boolean = false
    edit: boolean = false
    loading: boolean = false

    constructor(private productServices: ProductService) { }
    
    submit(){
        this.loading = true
        if (this.slide && !this.product.slide._id) this.product.slide = { url: this.slideFile.file.name }
        if (!this.slide && this.product.slide != undefined && this.product.slide._id) this.product.slide.url = '#delete'
        if (this.slide) this.slideFile = { url: '' }
        this.product.image = [{ url: '' }]
        for (let i = 0; i < this.images.length; i++) {
            const im = this.images[i]
            if (i == 0) {
                this.product.image[0].url = im.file? im.file.name: im.url    //Es justo y necesario
                if (im.color != undefined && im.color != 'undefined')
                    this.product.image[0].color = im.color
                if (im.variant != undefined && im.variant != '')
                    this.product.image[0].variant = im.variant
            }else{
                let tem: Image = { url: im.file? im.file.name: im.url }
                if (im.color != undefined && im.color != 'undefined')
                    tem.color = im.color
                if (im.variant != undefined && im.variant != '')
                    tem.variant = im.variant
                this.product.image.push(tem)
            }
        }
        if(this.edit){
            this.productServices.updateProduct(this.product, this.images, this.slideFile.file).subscribe(res =>{
                if (res == 'ok'){
                    this.updateProducts.next()
                    this.alert.showAlert('Producto', 'El producto se modificó correctamente.')
                    this.cancelEdit()
                }else{
                    this.alert.showAlert('Error al modificar producto', JSON.stringify(res))
                }
                this.loading = false
            })
        }else{
            this.productServices.createProduct(this.product, this.images, this.slideFile.file).subscribe(res => {
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
        console.log('editproduct', product)
        this.edit = true
        this.product = product
        this.categories = this.getSection(product.section).category
        this.subcategories = this.getCategory(product.category).subcategory
        this.images = product.image
        if (product.slide) {
            this.slide = true
            this.slideFile = { url: product.slide.url }
        }else{
            this.product.slide = { url: '' }
            this.slide = false
            this.slideFile = { url: '' }
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
            image: [{ url:'' }],
            section: '',
            category: '',
            subcategory: '',
            brand: ''
        }
        this.slide = false
        this.slideFile = { url: '' }
        this.images = []
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

    validateForm(){
        return this.product.section == undefined || this.product.section == '' ||
            //this.product.subcategory == undefined || this.product.subcategory == '' ||
            this.product.category == undefined || this.product.category == '' ||
            this.product.brand == undefined || this.product.brand == '' || this.images.length == 0 ||
            (this.slide && this.slideFile.url == '')
    }

    ngOnInit() {
        
    }

    getSlide(){
        var reader = new FileReader()
        reader.onload = (e) => {
            this.slideFile.url = (<any>e.target).result
        }
        reader.readAsDataURL(this.slideFile.file)
    }

    getImage(image: File, i){
        var reader = new FileReader()
        reader.onload = (e) => {
            this.images[i].url = (<any>e.target).result
        }
        reader.readAsDataURL(image)
    }

    inputFile(files: File[]){
        for (let i = 0; i < files.length; i++) {
            const fl = files[i];
            this.images.push({ file: fl, url: '' })
            this.getImage(fl, this.images.length-1)
        }
    }

    swapMain(i){
        var t = this.images[0]
        this.images[0] = this.images[i]
        this.images[i] = t
    }

    test(){
        console.log(this.images)
        if(this.images.length != 0) console.log(this.images[0].color == 'undefined' || this.images[0].color == undefined)
    }

    getImageSrc(url: String){
        return url.toLowerCase().startsWith('http') || url.toLowerCase().startsWith('data:') || url == ''? url: `${Constants.url}/images/${url}`
    }

}
