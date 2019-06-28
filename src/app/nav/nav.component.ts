import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core'
import { CategoryBrandService } from '../Services/category-brand.service'
import { Category } from '../interfaces/Category'
import { Constants } from '../constants'

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {

    categories: Category[]
    brands: Brand[]
    title: String = Constants.title
    sticky: Number = 100
    scroll: Number = 0
    @Output() categoryEmitter = new EventEmitter<Category[]>()
    @Output() brandEmitter = new EventEmitter<Brand[]>()

    @HostListener("window:scroll", ['$event'])
    scrollEvent($event:Event){
        this.scroll = (<any>$event.srcElement).children[0].scrollTop;
        //console.log("window scroll: ", scrollOffset);
    }

    constructor(private categoryServices: CategoryBrandService) { }

    is_active: boolean = false

    ngOnInit() {
        this.getCategories()
        this.getBrands()
    }

    toggle(){
        this.is_active = !this.is_active
    }

    getCategories(){
        this.categoryServices.getCategories().subscribe(res => {
            this.categories = res
            this.categoryEmitter.next(res)
        })
    }

    getBrands(){
        this.categoryServices.getBrands().subscribe(res => {
            this.brands = res
            this.brandEmitter.next(res)
        })
    }

}
