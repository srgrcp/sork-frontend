import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core'
import { Category } from '../../interfaces/Category'
import { CategoryBrandService } from '../../Services/category-brand.service'
import { AlertComponent } from '../../alert/alert.component'
import { Section } from '../../interfaces/Section'

@Component({
    selector: 'app-admin-section',
    templateUrl: './admin-section.component.html',
    styleUrls: ['./admin-section.component.sass']
})
export class AdminSectionComponent implements OnInit {

    @ViewChild(AlertComponent) alert: AlertComponent
    @Output() refreshSections = new EventEmitter<boolean>()
    @Input() sections: Section[]
    section: String = 'n'
    name: String = ''
    loading: boolean = false

    constructor(private categoryService: CategoryBrandService) { }

    ngOnInit() {
    }

    getSection(_id: String){
        return this.sections.find(s => s._id == _id)
    }

    submit(){
        this.loading = true
        if (this.section == 'n')
            this.categoryService.createSection(this.name).subscribe(res => {
                if (res == 'ok') this.refreshSections.next()
                else if (res == '11000') this.alert.showAlert('Error al crear sección', 'Ya existe una sección con ese nombre.')
                else this.alert.showAlert('Error al crear sección', JSON.stringify(res))
                this.loading = false
            })
        else this.categoryService.updateSection(this.section, this.name).subscribe(res => {
            if (res == 'ok') this.refreshSections.next()
            else if (res == '11000') this.alert.showAlert('Error al actualizar sección', 'Ya existe una sección con ese nombre.')
            else this.alert.showAlert('Error al actualizar sección', JSON.stringify(res))
            this.loading = false
        })
        this.section = 'n'
        this.name = ''
    }

    delete(){
        this.alert.showAlert('Eliminar sección', `¿Seguro desea eliminar la sección '${this.getSection(this.section).name}' y todas sus categorías?`, next => {
            this.loading = true
            this.categoryService.deleteSection(this.section).subscribe(res => {
                if (res == 'ok') {next();this.refreshSections.next(true)}
                else {next();this.alert.showAlert('Error al eliminar sección', JSON.stringify(res))}
                this.section = 'n'
                this.name = ''
                this.loading = false
            })
        })
    }

}
