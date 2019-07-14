import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { ProductService } from '../Services/product.service'
import { Category } from '../interfaces/Category'
import { Product } from '../interfaces/Product'
import { Constants } from '../Constants'
import { Title } from '@angular/platform-browser'
import { Section } from '../interfaces/Section'

interface Brand{ _id?:String, name: String }
interface Query{
    _id?: String
    description?: String
    sizes?: string
    colors?: string
    minPrice?: Number
    maxPrice?: Number
    section?: String
    category?: String
    subcategory?: String
    brand?: String
}
interface ServerData{ size: { min: number, max: number }, count: number }
interface Subcategory{ _id?:String, name: String }

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.sass']
})
export class CatalogComponent implements OnInit, OnDestroy {

    sectionName: String
    categoryName: String
    subcategoryName: String
    brandName: String
    state: String[] = []
    sections: Section[]
    categories: Category[]
    subcategories: Subcategory[]
    brands: Brand[]
    products: Product[]
    page: number = 1
    query: Query = { description: '' }
    initialQuery: Query = {}
    loaded: boolean = false
    title: String = Constants.title
    array: any[]
    arrayMobile: any[]
    arraySizes: any[]
    arrayColor = []
    ccolors = Constants.colors
    arrayPages: number[]
    serverData: ServerData
    sizes: number[] = []
    colors: string[] = []
    filter: boolean = false
    pages: number
    console: string = `'Console'\n`

    testCount: number = 750

    constructor(
        private titleService: Title,
        private route: ActivatedRoute,
        private productService: ProductService,
        private router: Router,
        private renderer: Renderer2
    ) { }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'has-background-light')
    }

    ngOnInit() {
        this.renderer.addClass(document.body, 'has-background-light')
        this.console += `oninit\n`
        this.query.description = ''
        //this.arrayColor = new Array(Constants.colors.length)
        this.arrayColor = []
        for (let i = 0; i < this.ccolors.length; i++)
            this.arrayColor.push({ color: this.ccolors[i], checked: false })
        this.route.paramMap.subscribe((p: Params) => {
            this.query = { description: '' }
            let params = p.params
            this.sectionName = params.section
            this.categoryName = params.category
            this.subcategoryName = params.subcategory
            this.brandName = params.brand
            if(params.page) this.page = params.page
            this.whatIs()
            this.titleService.setTitle(`${Constants.title} - ${this.getState()}`)
            if(this.loaded) {
                this.initQuery()
                this.getProducts()
            }
        })
        this.route.data.subscribe(d => {
            if(d.query) this.query.description = d.query
            if (d.description || d.sizes || d.minPrice || d.maxPrice) this.query = d
            //this.router.config.find(r => r.path === 'Catalogo').data = undefined
            this.router.config.forEach(r => {
                r.data = undefined
            });
        })
    }

    getURL(product: Product){
        let description = product.description
        if (description.length > 50) description = description.substr(0, 50)
        description = description.replace(/ /g, '-')
        return `${description}-${product._id}`
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

    sizeCheck(n: number, checked){
        /*if (!this.sizes.includes(n)) this.sizes.push(n)
        else this.sizes.splice(this.sizes.indexOf(n), 1)
        console.log(this.sizes)
        this.query.sizes = ''
        for (let i = 0; i < this.sizes.length; i++)
            this.query.sizes += i==this.sizes.length-1? this.sizes[i]: this.sizes[i]+','*/
        let size = n + this.serverData.size.min
        if (checked) this.sizes.push(size)
        else this.sizes.splice(this.sizes.indexOf(size), 1)
        this.query.sizes = ''
        for (let i = 0; i < this.sizes.length; i++)
            this.query.sizes += i==this.sizes.length-1? this.sizes[i]: this.sizes[i]+','
    }

    colorCheck(n: number, checked: boolean){
        if (checked) this.colors.push(this.arrayColor[n].color)
        else this.colors.splice(this.colors.indexOf(this.arrayColor[n].color), 1)
        this.query.colors = ''
        for (let i = 0; i < this.colors.length; i++)
            this.query.colors += i==this.colors.length-1? this.colors[i]: this.colors[i]+','
    }

    getArray(){
        this.array = new Array(Math.ceil(this.products.length/3))
        this.arrayMobile = new Array(Math.ceil(this.products.length/2))
    }

    whatIs(){
        this.state.push('catalog')
        if (this.sectionName) {
            this.state.push('section')
        }
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

    changed(){
        let sec = this.sections.find(s=>s._id==this.query.section)
        if (sec != undefined)
            {if (this.sectionName != sec.name) return true}
        else
            {if (this.sectionName != undefined) return true}
        if (this.categories != undefined){
            let cat = this.categories.find(c=>c._id==this.query.category)
            if (cat != undefined)
                {if (this.categoryName != cat.name) return true}
            else
                {if (this.categoryName != undefined) return true}
        }
        else {
            if (this.categoryName != undefined) return true
        }
        if (this.subcategories != undefined){
            let sub = this.subcategories.find(s=>s._id==this.query.subcategory)
            if (sub != undefined)
                {if (this.subcategoryName != sub.name) return true}
            else
                {if (this.subcategoryName != undefined) return true}
        }
        else {
            if (this.subcategoryName != undefined) return true
        }
        let br = this.brands.find(b=>b._id==this.query.brand)
        if (br != undefined)
            {if (this.brandName != br.name) return true}
        else
            {if (this.brandName != undefined) return true}
        return false
    }

    SectionName(){
        let sec = this.sections.find(s=>s._id == this.query.section)
        return sec != undefined? sec.name: ''
    }

    CategoryName(){
        let cat = this.categories.find(c=>c._id==this.query.category)
        return cat != undefined? cat.name: ''
    }

    SubcategoryName(){
        if (this.subcategories == undefined) return ''
        let sub = this.subcategories.find(s=>s._id==this.query.subcategory)
        return sub != undefined? sub.name: ''
    }

    BrandName(){
        let br = this.brands.find(b=>b._id==this.query.brand)
        return br != undefined? br.name: ''
    }

    getNewURL(newPage?: boolean, resetPage?: boolean){
        let url = ''
        if (this.changed() || newPage || resetPage){
            if (newPage) {this.query = undefined;this.query = this.initialQuery}
            if (this.query.section) url += `/${this.SectionName()}`
            if (this.query.category) url += `/${this.CategoryName()}`
            if (this.query.subcategory) url += `/${this.SubcategoryName()}`
            if (this.query.brand) url += `/Marcas/${this.BrandName()}`
            url = url==''?'Catalogo':url
            if (this.page != 1) url += `/Pagina/${this.page}`
            //this.router.config.find(r => r.component === CatalogComponent)
            for (let i = 0; i < this.router.config.length; i++) {
                let r = this.router.config[i]
                if (r.component == CatalogComponent) r.data = this.query
            }
            console.log('getnewurl', this.query)
            this.router.navigate([url==''?'Catalogo':url])
        }
    }

    initQuery(){
        if (this.state.includes('subcategory'))
            this.getSubcategoryID()
        if (this.state.includes('category') && !this.state.includes('subcategory'))
            this.getCategoryId()
        if (this.state.includes('section') && !this.state.includes('category'))
            this.getSectionId()
        if (this.state.includes('brand'))
            this.getBrandId()
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

    getSectionId(){
        this.query.section = this.sections.find(s => s.name == this.sectionName)._id
        this.fillCategories()
    }

    getCategoryId(){
        let sec = this.sections.find(s => s.name == this.sectionName)
        this.query.section = sec._id
        this.fillCategories()
        this.query.category = this.categories.find(c => c.name == this.categoryName)._id
        this.fillSubcategories()
    }

    getSubcategoryID(){
        let sec = this.sections.find(s => s.name == this.sectionName)
        this.query.section = sec._id
        this.fillCategories()
        let cat = this.categories.find(c => c.name == this.categoryName)
        this.query.category = cat._id
        this.fillSubcategories()
        this.query.subcategory = cat.subcategory.find(s => s.name == this.subcategoryName)._id
    }

    getBrandId(){
        this.query.brand = this.brands.find(b => b.name == this.brandName)._id
    }

    getSections(sections: Section[]){
        this.sections = sections
        this.console += 'getting sections\n'
        if (this.brands) {
            this.console += 'sections ok\n'
            this.initQuery()
            this.getProducts()
        }
    }

    getBrands(brands: Brand[]){
        this.brands = brands
        this.console += 'getting brands\n'
        if (this.sections) {
            this.console += 'brands ok\n'
            this.initQuery()
            this.getProducts()
        }
    }

    getProducts(query?: String, resetPage?){
        /*Object.entries(this.query).forEach(([k, v]) => {
            if (v === '') delete this.query[k]
        })*/
        console.log('getproducts', query, resetPage)
        if (resetPage) {
            this.page = 1
            this.getNewURL(false, true)
        }
        else this.getNewURL()
        if (query) {
            this.page = 1
            this.query = { description: query }
            //this.query.description = query
            this.router.config.find(r => r.path === 'Catalogo').data = undefined
        }
        this.productService.getProducts(this.page, this.query).subscribe(res => {
            this.console += `getting products\n`
            this.products = res
            this.getArray()
            //this.buildPagination()
            //this.loaded = true
            Object.entries(this.query).forEach(([k, v]) => this.initialQuery[k] = v)
            console.log('initialQuery', this.initialQuery)
            this.productService.getData(this.query).subscribe(res => {
                this.console += `getting data\n${JSON.stringify(res)}\n`
                this.serverData = <ServerData>res
                this.arraySizes = new Array(this.serverData.size.max-this.serverData.size.min+1)
                for (let i = 0; i < this.arraySizes.length; i++)
                    this.arraySizes[i] = {checked: false}
                if (this.query.sizes){
                    let s = this.query.sizes.split(',')
                    this.sizes = []
                    for (let i = 0; i < s.length; i++) {
                        let n = parseInt(s[i])
                        this.sizes.push(n)
                        this.arraySizes[n-this.serverData.size.min].checked = true
                    }
                }
                for (let i = 0; i < this.arrayColor.length; i++)
                    this.arrayColor[i] = { color: this.ccolors[i], checked: false }
                if (this.query.colors){
                    let c = this.query.colors.split(',')
                    this.colors = c
                    console.log(c)
                    for (let i = 0; i < c.length; i++) {
                        this.arrayColor[this.arrayColor.findIndex(a => a.color == c[i])].checked = true
                        
                    }
                }
                this.buildPagination()
                this.loaded = true
                this.console += `loaded: ${this.loaded}\n`
            })
        })
    }

    getState(){
        switch (this.state[this.state.length-1]) {
            case 'catalog':
                return 'Catálogo'
            case 'section':
                return this.sectionName
            case 'category':
                return this.categoryName
            case 'subcategory':
                return this.subcategoryName
            case 'brand':
                return this.brandName
        }
    }

    test(){
        console.log(this.initialQuery)
    }

}
