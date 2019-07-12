import { Component, OnInit } from '@angular/core'
import { ContentService } from 'src/app/Services/content.service'
import { toast } from 'bulma-toast'
import { Slide } from 'src/app/interfaces/Product'
import { ProductService } from 'src/app/Services/product.service'
import { Constants } from 'src/app/Constants';

@Component({
    selector: 'app-admin-content',
    templateUrl: './admin-content.component.html',
    styleUrls: ['./admin-content.component.sass']
})
export class AdminContentComponent implements OnInit {

    contentIndex: number = 0
    slide: File
    slideURL: string = ''
    ref: string = ''
    description: string = ''
    slides: Slide[] = []

    constructor(
        private contentService: ContentService,
        private productService: ProductService
        ) { }

    ngOnInit() {this.getSlides()}

    getSlides(){
        this.productService.getSlides().subscribe(res => {
            this.slides = res
        })
    }

    getURL(url: string){
        return url.startsWith('http')? url: `${Constants.url}/images/${url}`
    }

    getImage(image: File){
        var reader = new FileReader()
        reader.onload = (e) => {
            this.slideURL = (<any>e.target).result
        }
        reader.readAsDataURL(image)
    }

    inputFile(file: File){
        this.slide = file
        this.getImage(this.slide)
    }

    createSlide(){
        this.contentService.createSlide(this.slide, this.ref, this.description).subscribe(res => {
            if (res == 'ok'){
                this.slide = undefined
                this.slideURL = ''
                this.description = ''
                this.getSlides()
            }
            else{
                toast({
                    message: `
                        <div class="container padding">
                            Ocurrió un error al crear slide.
                            <div class="buttons is-centered" style="margin-top:1rem">
                                <button type="button" class="button is-white is-rounded">Aceptar</button>
                            </div>
                        </div>
                        `,
                    position: 'bottom-center',
                    type: 'is-danger',
                    dismissible: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    animate: { in: 'fadeIn', out: 'fadeOut' }
                })
            }
        })
    }

}
