import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core'
import { UserService } from './Services/auth.service'
import { Meta } from '@angular/platform-browser'

declare const fbq: any

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
        fbq('track', 'PageView')
        this.userServices.onInit()
        this.meta.addTag({ name: 'theme-color', content: '#4a2d92' })
        console.log('app oninit')
    }

}
