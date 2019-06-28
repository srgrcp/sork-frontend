import { Component, OnInit } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Constants } from '../constants'
import { ProductService } from '../Services/product.service'

interface Slide{ index?: Number, _id: String, url: String, product: { _id: String, description: String }, class?: String }

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.sass']
})
export class RootComponent implements OnInit {

    test: any[] = [ {class:'slider',id:0,url:'https://sneakernews.com/wp-content/uploads/2017/12/10-best-adidas-2017-8.jpg'}, {class:'slider visuallyhidden srg-hide',id:1,url:'https://scontent.fbaq2-1.fna.fbcdn.net/v/t1.0-9/64667808_324134621841848_7366946163452280832_n.jpg?_nc_cat=104&_nc_ht=scontent.fbaq2-1.fna&oh=07a4cea1360e62d9e8a4e6aeb6be457e&oe=5DC0EB08'} ]
    slides: Slide[]
    sliderIndex: number = 0
    firstTime: boolean = true

    constructor(
        private titleService: Title,
        private productService: ProductService
        ) { }

    ngOnInit() {
        this.titleService.setTitle(`${Constants.title}`)
        this.getSlides()
    }

    nextSlide(){
        let current = this.sliderIndex
        this.sliderIndex++
        if (this.sliderIndex >= this.slides.length) this.sliderIndex = 0
        this.slide(current, this.sliderIndex)
    }

    slideShow(){
        if (this.firstTime) this.firstTime = false
        else this.nextSlide()
        setTimeout(() => this.slideShow(), 8000)
    }

    slide(current, _new){
        this.slides[current].class = 'slider visuallyhidden'
        setTimeout(() => {
            this.slides[current].class = 'slider visuallyhidden srg-hide'
            this.slides[_new].class = 'slider visuallyhidden'
            setTimeout(() => this.slides[_new].class = 'slider', 20)
        }, 200)
    }

    getSlides(){
        this.productService.getSlides().subscribe(res => {
            this.slides = res
            for (let i = 0; i < this.slides.length; i++) {
                this.slides[i].index = i
                this.slides[i].class = i == 0? 'slider': 'slider visuallyhidden srg-hide'
                if (this.slides[i].product.description.length > 50) this.slides[i].product.description = this.slides[i].product.description.substr(0, 50)
                this.slides[i].product.description = this.slides[i].product.description.replace(/ /g, '-')
            }
            this.slideShow()
        })
    }

}
