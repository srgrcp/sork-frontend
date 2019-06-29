import { Component, OnInit } from '@angular/core'
import { UserService } from './Services/auth.service'
import { Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

    constructor(
        private userServices: UserService,
        private meta: Meta
        ) { }

    ngOnInit(){
        this.userServices.onInit()
        this.meta.addTag({ name: 'theme-color', content: '#4a2d92' })
    }

}
