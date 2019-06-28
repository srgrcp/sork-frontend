import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { ProductService } from '../../Services/product.service'
import { AlertComponent } from '../../alert/alert.component'

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-admin-brand',
    templateUrl: './admin-brand.component.html',
    styleUrls: ['./admin-brand.component.sass']
})
export class AdminBrandComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshBrands = new EventEmitter<boolean>()
    @Input() brands: Brand[]
    brand: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(
        private productService: ProductService,
        private categoryService: CategoryBrandService
    ) { }

    getBrand(_id: String){
        return this.brands.find(b => b._id == _id)
    }

    submit(){
        this.loading = true
        if (this.brand == 'n') this.categoryService.createBrand(this.name).subscribe(res => {
            if (res == 'ok') this.refreshBrands.next()
            else if (res == '11000') this.alert.showAlert('Error al registrar marca', 'Ya existe una marca con ese nombre.')
            else this.alert.showAlert('Error al registrar marca', res)
            this.loading = false
        })
        else this.categoryService.updateBrand(this.brand, this.name).subscribe(res => {
            if (res == 'ok') this.refreshBrands.next()
            else if (res == '11000') this.alert.showAlert('Error al actualizar marca', 'Ya existe una marca con ese nombre.')
            else this.alert.showAlert('Error al actualizar marca', res)
            this.loading = false
        })
        this.brand = 'n'
        this.name = ''
    }

    delete(){
        this.alert.showAlert('Eliminar Marca', `¿Seguro desea eliminar la marca '${this.getBrand(this.brand).name}'?`, next => {
            this.loading = true
            this.categoryService.deleteBrand(this.brand).subscribe(res => {
                if (res == 'ok') {next();this.refreshBrands.next(true)}
                else {next();this.alert.showAlert('Error al eliminar marca', res)}
                this.brand = 'n'
                this.name = ''
                this.loading = false
            })
        })
    }

    ngOnInit() {
    }

}
