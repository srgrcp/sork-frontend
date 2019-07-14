import { Component, OnInit, ViewChild } from '@angular/core'
import { ContentService } from 'src/app/Services/content.service'
import { toast } from 'bulma-toast'
import { Slide, Product } from 'src/app/interfaces/Product'
import { ProductService } from 'src/app/Services/product.service'
import { Constants } from 'src/app/Constants';
import { AlertComponent } from 'src/app/alert/alert.component'

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
    @ViewChild(AlertComponent) alert: AlertComponent

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
        return url.startsWith('http')? url: `${Constants.url}/slides/${url}`
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
                this.ref = ''
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

    productURL(product: Product){
        let desc = product.description
        if (desc.length > 50) desc = desc.substr(0, 50)
        desc = desc.replace(/ /g, '-')
        return `/Producto/${desc}-${product._id}`
    }

    deleteSlide(slide: Slide){
        this.alert.showAlert('Slider', '¿Seguro desea eliminar el slide seleccionado?', next => {
            this.contentService.deleteSlide(slide._id).subscribe(res => {
                this.getSlides()
                /*Poner algo aquí lol*/
            })
            next()
        })
    }

}
