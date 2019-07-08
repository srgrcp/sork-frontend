import { Component, OnInit, Input } from '@angular/core'
import { Section } from '../interfaces/Section'
import { Constants } from '../Constants'

interface Brand{ _id?:String, name: String }

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {

    title: String = Constants.title

    @Input() brands: Brand[] = []
    @Input() sections: Section[] = []

    constructor() { }

    ngOnInit() {
    }

}
