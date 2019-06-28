import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { AlertComponent } from '../../alert/alert.component'

interface Subcategory{ _id?:String, name: String }

@Component({
    selector: 'app-admin-subcategory',
    templateUrl: './admin-subcategory.component.html',
    styleUrls: ['./admin-subcategory.component.sass']
})
export class AdminSubcategoryComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshCategories = new EventEmitter<boolean>()
    @Input() categories: Category[]
    subcategories: Subcategory[]
    category: String = ''
    subcategory: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(private categoryService: CategoryBrandService) { }

    categoryChanged(deleted?: boolean){
        if (deleted){
            this.category = ''
            this.subcategories = undefined
            this.subcategory = 'n'
            this.name = ''
            return
        }
        if (this.category != '') this.subcategories = this.getCategory(this.category).subcategory
        else this.subcategories = undefined
        this.subcategory = 'n'
        this.name = ''
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

    getSubcategory(_id: String){
        return this.subcategories.find(s => s._id == _id)
    }

    delete(){
        this.alert.showAlert('Eliminar Subcategoría', `¿Seguro desea eliminar la subcategorpia '${this.getSubcategory(this.subcategory).name}'?`, next => {
            this.loading = true
            this.categoryService.deleteSubcategory(this.category, this.subcategory).subscribe(res => {
                if (res == 'ok') {next();this.refreshCategories.next(true)}
                else {next();this.alert.showAlert('Error al eliminar Subcategoría', res)}
                this.category = ''
                this.categoryChanged()
                this.loading = false
            })
        })
    }

    submit(){
        this.loading = true
        if (this.subcategory == 'n') this.categoryService.createSubcategory(this.category, this.name).subscribe(res => {
            if (res == 'ok') this.refreshCategories.next()
            else if (res == '11000') this.alert.showAlert('Error al crear subcategoría', 'Ya existe una subcategoría con ese nombre.')
            else this.alert.showAlert('Error al crear subcategoría', res)
            this.category = ''
            this.categoryChanged()
            this.loading = false
        })
        else this.categoryService.updateSubcategory(this.category, this.subcategory, this.name).subscribe(res => {
            if (res == 'ok') this.refreshCategories.next()
            else if (res == '11000') this.alert.showAlert('Error al subactualizar categoría', 'Ya existe una subcategoría con ese nombre.')
            else this.alert.showAlert('Error al actualizar subcategoría', res)
            this.category = ''
            this.categoryChanged()
            this.loading = false
        })
    }

    ngOnInit() {
    }

}
