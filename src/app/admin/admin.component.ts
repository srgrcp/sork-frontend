import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from "@angular/router"
import { Product } from '../interfaces/Product'
import { Category } from '../interfaces/Category'
import { ProductListComponent } from './product-list/product-list.component'
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component'
import { Title } from '@angular/platform-browser'
import { Constants } from '../constants'
import { CategoryBrandService } from '../Services/category-brand.service'
import { AdminSubcategoryComponent } from './admin-subcategory/admin-subcategory.component'

interface Brand{ _id?:String, name: String }

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

    tabIndex: number = 0
    brands: Brand[]
    categories: Category[]

    @ViewChild(ProductListComponent) productListComponent: ProductListComponent
    @ViewChild(AdminProductFormComponent) adminProductFormComponent: AdminProductFormComponent
    @ViewChild(AdminSubcategoryComponent) subcategoryComponent: AdminSubcategoryComponent

    constructor(
        private router: Router,
        private titleService: Title,
        private categoryServices: CategoryBrandService
        ) { }

    ngOnInit() {
        if(!localStorage.getItem('token')) this.router.navigate(['/admin/login'])
        this.titleService.setTitle(`${Constants.title} - Admin Panel`)
        this.getCategoriesAndBrands()
    }

    switchIndex(index){
        this.tabIndex = index
    }

    getCategoriesAndBrands(deleteCat?: boolean){
        this.categoryServices.getCategories().subscribe(res => this.categories = res)
        this.categoryServices.getBrands().subscribe(res => this.brands = res)
        if (deleteCat) {
            this.subcategoryComponent.categoryChanged(true)
            this.adminProductFormComponent.categoryChanged(true)
        }
        this.updateProducts()
    }

    editProduct(product: Product){
        this.adminProductFormComponent.editProduct(product)
        this.tabIndex = 0
    }

    updateProducts(){
        this.productListComponent.getProducts()
    }

}
