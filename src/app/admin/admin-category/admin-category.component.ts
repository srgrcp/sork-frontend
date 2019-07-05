import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { AlertComponent } from '../../alert/alert.component'
import { Section } from '../../interfaces/Section'

@Component({
    selector: 'app-admin-category',
    templateUrl: './admin-category.component.html',
    styleUrls: ['./admin-category.component.sass']
})
export class AdminCategoryComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshSections = new EventEmitter<boolean>()
    @Input() sections: Section[]
    categories: Category[]
    section: String = ''
    category: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(
        private categoryService: CategoryBrandService
    ) { }

    sectionChange(){
        this.name = ''
        let sec = this.getSection(this.section)
        if (sec) this.categories = sec.category
        else this.categories = undefined
        this.category = 'n'
    }

    getSection(_id: String){
        return this.sections.find(s => s._id == _id)
    }

    getCategory(_id: String){
        return this.categories.find(c => c._id == _id)
    }

    submit(){
        this.loading = true
        if (this.category == 'n') this.categoryService.createCategory(this.section, this.name).subscribe(res => {
            if (res == 'ok') this.refreshSections.next()
            else if (res == '11000') this.alert.showAlert('Error al crear categoría', 'Ya existe una categoría con ese nombre.')
            else this.alert.showAlert('Error al crear categoría', JSON.stringify(res))
            this.loading = false
        })
        else this.categoryService.updateCategory(this.category, this.name).subscribe(res => {
            if (res == 'ok') this.refreshSections.next()
            else if (res == '11000') this.alert.showAlert('Error al actualizar categoría', 'Ya existe una categoría con ese nombre.')
            else this.alert.showAlert('Error al actualizar categoría', JSON.stringify(res))
            this.loading = false
        })
        this.section = ''
        this.categories = undefined
        this.category = 'n'
        this.name = ''
    }

    delete(){
        this.alert.showAlert('Eliminar Categoría', `¿Seguro desea eliminar la categoría '${this.getCategory(this.category).name}' y todas sus subcategorías?`, next => {
            this.loading = true
            this.categoryService.deleteCategory(this.category).subscribe(res => {
                if (res == 'ok') {next();this.refreshSections.next(true)}
                else {next();this.alert.showAlert('Error al eliminar categoría', JSON.stringify(res))}
                this.section = ''
                this.categories = undefined
                this.category = 'n'
                this.name = ''
                this.loading = false
            })
        })
    }

    ngOnInit() {
    }

}
