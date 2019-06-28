import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { AlertComponent } from '../../alert/alert.component'

@Component({
    selector: 'app-admin-category',
    templateUrl: './admin-category.component.html',
    styleUrls: ['./admin-category.component.sass']
})
export class AdminCategoryComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshCategories = new EventEmitter<boolean>()
    @Input() categories: Category[]
    category: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(
        private categoryService: CategoryBrandService
    ) { }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

    submit(){
        this.loading = true
        if (this.category == 'n') this.categoryService.createCategory(this.name).subscribe(res => {
            if (res == 'ok') this.refreshCategories.next()
            else if (res == '11000') this.alert.showAlert('Error al crear categoría', 'Ya existe una categoría con ese nombre.')
            else this.alert.showAlert('Error al crear categoría', res)
            this.loading = false
        })
        else this.categoryService.updateCategory(this.category, this.name).subscribe(res => {
            if (res == 'ok') this.refreshCategories.next()
            else if (res == '11000') this.alert.showAlert('Error al actualizar categoría', 'Ya existe una categoría con ese nombre.')
            else this.alert.showAlert('Error al actualizar categoría', res)
            this.loading = false
        })
        this.category = 'n'
        this.name = ''
    }

    delete(){
        this.alert.showAlert('Eliminar Categoría', `¿Seguro desea eliminar la categoría '${this.getCategory(this.category).name}' y todas sus subcategorías?`, next => {
            this.loading = true
            this.categoryService.deleteCategory(this.category).subscribe(res => {
                if (res == 'ok') {next();this.refreshCategories.next(true)}
                else {next();this.alert.showAlert('Error al eliminar categoría', res)}
                this.category = 'n'
                this.name = ''
                this.loading = false
            })
        })
    }

    ngOnInit() {
    }

}
