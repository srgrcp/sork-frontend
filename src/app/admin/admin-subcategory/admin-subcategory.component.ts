import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { AlertComponent } from '../../alert/alert.component'
import { Section } from '../../interfaces/Section';

interface Subcategory{ _id?:String, name: String }

@Component({
    selector: 'app-admin-subcategory',
    templateUrl: './admin-subcategory.component.html',
    styleUrls: ['./admin-subcategory.component.sass']
})
export class AdminSubcategoryComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshSections = new EventEmitter<boolean>()
    @Input() sections: Section[]
    categories: Category[]
    subcategories: Subcategory[]
    section: String = ''
    category: String = ''
    subcategory: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(private categoryService: CategoryBrandService) { }

    sectionChanged(deleted?: boolean){
        if (deleted){
            this.section = ''
            this.categories = undefined
            this.category = ''
            this.subcategories = undefined
            this.subcategory = 'n'
            this.name = ''
            return
        }
        let sec = this.getSection(this.section)
        if (sec) {
            this.categories = sec.category
            this.category = ''
            this.subcategories = undefined
        }
        else {
            this.categories = undefined
            this.category = ''
            this.subcategories = undefined
        }
        this.subcategory = 'n'
        this.name = ''
    }

    categoryChanged(){
        if (this.category != '') this.subcategories = this.getCategory(this.category).subcategory
        else this.subcategories = undefined
        this.subcategory = 'n'
        this.name = ''
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

    delete(){
        this.alert.showAlert('Eliminar Subcategoría', `¿Seguro desea eliminar la subcategorpia '${this.getSubcategory(this.subcategory).name}'?`, next => {
            this.loading = true
            this.categoryService.deleteSubcategory(this.category, this.subcategory).subscribe(res => {
                if (res == 'ok') {next();this.refreshSections.next(true)}
                else {next();this.alert.showAlert('Error al eliminar Subcategoría', res)}
                this.section = ''
                this.category = ''
                this.sectionChanged()
                this.loading = false
            })
        })
    }

    submit(){
        this.loading = true
        if (this.subcategory == 'n') this.categoryService.createSubcategory(this.section, this.category, this.name).subscribe(res => {
            if (res == 'ok') this.refreshSections.next()
            else if (res == '11000') this.alert.showAlert('Error al crear subcategoría', 'Ya existe una subcategoría con ese nombre.')
            else this.alert.showAlert('Error al crear subcategoría', res)
            this.section = ''
            this.category = ''
            this.sectionChanged()
            this.loading = false
        })
        else this.categoryService.updateSubcategory(this.category, this.subcategory, this.name).subscribe(res => {
            if (res == 'ok') this.refreshSections.next()
            else if (res == '11000') this.alert.showAlert('Error al subactualizar categoría', 'Ya existe una subcategoría con ese nombre.')
            else this.alert.showAlert('Error al actualizar subcategoría', res)
            this.section = ''
            this.category = ''
            this.sectionChanged()
            this.loading = false
        })
    }

    ngOnInit() {
    }

}
