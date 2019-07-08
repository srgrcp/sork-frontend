import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from "@angular/router"
import { Product } from '../interfaces/Product'
import { Category } from '../interfaces/Category'
import { ProductListComponent } from './product-list/product-list.component'
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component'
import { Title } from '@angular/platform-browser'
import { Constants } from '../Constants'
import { CategoryBrandService } from '../Services/category-brand.service'
import { AdminSubcategoryComponent } from './admin-subcategory/admin-subcategory.component'
import { Section } from '../interfaces/Section'

interface Brand{ _id?:String, name: String }

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

    tabIndex: number = 0
    brands: Brand[]
    sections: Section[]
    categories: Category[]
    productIndex: number = 0

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
        this.getSections()
    }

    switchIndex(index){
        this.tabIndex = index
    }

    getSections(deleteSec?: boolean){
        this.categoryServices.getSections().subscribe(res => this.sections = res)
        this.categoryServices.getBrands().subscribe(res => this.brands = res)
        if (deleteSec) {
            this.subcategoryComponent.sectionChanged(true)
            this.adminProductFormComponent.sectionChanged(true)
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
