import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core'
import { UserService } from './Services/auth.service'
import { Meta } from '@angular/platform-browser'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {

    constructor(
        private userServices: UserService,
        private meta: Meta,
        private renderer: Renderer2
        ) {
    }

    ngOnDestroy() {
    }

    ngOnInit(){
        this.userServices.onInit()
        this.meta.addTag({ name: 'theme-color', content: '#4a2d92' })
        console.log('app oninit')
    }

}
