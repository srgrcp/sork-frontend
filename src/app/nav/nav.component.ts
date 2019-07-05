import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core'
import { CategoryBrandService } from '../Services/category-brand.service'
import { Category } from '../interfaces/Category'
import { Constants } from '../constants'
import { Router } from "@angular/router"
import { Section } from '../interfaces/Section';
import { ProductService } from '../Services/product.service';

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

    sections: Section[]
    brands: Brand[]
    title: String = Constants.title
    sticky: Number = 100
    scroll: Number = 0
    @Output() sectionEmitter = new EventEmitter<Section[]>()
    @Output() brandEmitter = new EventEmitter<Brand[]>()
    @Output() searchEmitter = new EventEmitter<String>()
    @Output() reloadEmitter = new EventEmitter()
    query: String = ''
    section: Section
    sectionMenu: boolean = false
    cartCount: number = 0

    @HostListener("window:scroll", ['$event'])
    scrollEvent($event:Event){
        this.scroll = (<any>$event.srcElement).children[0].scrollTop
    }

    constructor(
        private categoryServices: CategoryBrandService,
        private productService: ProductService,
        private router: Router
        ) { }

    is_active: boolean = false

    ngOnInit() {
        this.getSections()
        this.getBrands()
        this.productService.getCart().subscribe(res => {
            if(res) this.cartCount = res.items.length
        })
    }

    reload(url: string){
        if (this.router.url == url) this.reloadEmitter.next()
    }

    search(){
        if (this.query == '') return
        let catalog = this.router.config.find(r => r.path === 'Catalogo')
        catalog.data = { query: this.query }
        if (this.router.url == '/Catalogo') this.searchEmitter.next(this.query)
        else this.router.navigate(['Catalogo'])
    }

    toggle(){
        this.is_active = !this.is_active
    }

    getSections(){
        this.categoryServices.getSections().subscribe(res => {
            this.sections = res
            this.sectionEmitter.next(res)
        })
    }

    getBrands(){
        this.categoryServices.getBrands().subscribe(res => {
            this.brands = res
            this.brandEmitter.next(res)
        })
    }

}
