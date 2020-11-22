import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { ProductService } from '../Services/product.service'
import { Cart, Item, BuyerInfo, Order } from '../interfaces/Cart'
import { toast } from 'bulma-toast'
import { Constants } from '../Constants'

declare const fbq: any

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.sass']
})
export class CartComponent implements OnInit, OnDestroy {

    sections; brands
    cart: Cart
    items: Item[] = []
    buyer: BuyerInfo = {
        name: '',
        address: '',
        city: '',
        phone: undefined,
        email: ''
    }
    info: string = ''
    waitCheckout: boolean = false
    @ViewChild('payuForm') payuForm: ElementRef

    tabPayu: number = 0

    constructor(
        private productService: ProductService,
        private renderer: Renderer2
    ) { }

    ngOnInit() {
        this.renderer.addClass(document.body, 'has-background-light')
        this.productService.getCart().subscribe(res => {
            this.cart = res
            this.items = res.items
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'has-background-light')
    }

    getTotal(){
        let total: number = 0
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            total += item.product.price*item.quantity
        }
        return total
    }

    valid(){
        if (this.buyer.city == undefined || this.buyer.city == ''){
            toast({
                message: `Debe seleccionar una ciudad.`,
                position: 'bottom-center',
                type: 'is-danger',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return false
        }
        if (this.items.length < 1) {
            toast({
                message: `¡No hay productos en el carrito! 😱😱`,
                position: 'bottom-center',
                type: 'is-danger',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return false
        }
        if (this.tabPayu == 1){
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!re.test(this.buyer.email)){
                toast({
                    message: `Debe ingresar un correo valido.`,
                    position: 'bottom-center',
                    type: 'is-danger',
                    dismissible: true,
                    closeOnClick: true,
                    animate: { in: 'fadeIn', out: 'fadeOut' }
                })
                return false
            }
        }
        if (this.buyer.name.length < 3) {
            toast({
                message: `Debe ingresar un nombre valido.`,
                position: 'bottom-center',
                type: 'is-danger',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return false
        }
        if (this.buyer.address.length < 4) {
            toast({
                message: `Debe ingresar una dirección valida.`,
                position: 'bottom-center',
                type: 'is-danger',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return false
        }
        if (Math.floor(this.buyer.phone/10**9) != 3) {
            toast({
                message: `Debe ingresar un número de celular valido (10 dígitos, comenzando por 3).`,
                position: 'bottom-center',
                type: 'is-danger',
                dismissible: true,
                closeOnClick: true,
                animate: { in: 'fadeIn', out: 'fadeOut' }
            })
            return false
        }
        return true
    }

    checkout(){
        fbq('track', 'Purchase')
        if (!this.valid()) return
        this.waitCheckout = true
        toast({
            message: `
                <div class="container padding">
                    Tu compra se está procesando, por favor espera.
                    <div class="buttons is-centered" style="margin-top:1rem">
                        <button type="button" class="button is-white is-rounded">Aceptar</button>
                    </div>
                </div>
                `,
            position: 'center',
            type: 'is-primary',
            dismissible: true,
            closeOnClick: true,
            pauseOnHover: true,
            animate: { in: 'fadeIn', out: 'fadeOut' }
        })
        let order: Order
        if (this.info == '') order = { items: this.items, buyer: this.buyer }
        else order = { items: this.items, buyer: this.buyer, info: this.info }
        if (this.tabPayu == 0) {
            this.productService.checkout(order, this.tabPayu).subscribe(resu => {
                let res = <Order>resu
                if (res.shortid != undefined) {
                    this.productService.deleteCart()
                    let orders: string[] = JSON.parse(localStorage.getItem('orders'))
                    if (orders != undefined && orders.length != 0) orders.push(order._id)
                    else orders = [order._id]
                    localStorage.setItem('orders', JSON.stringify(orders))
                    toast({
                        message: `
                            <div class="container padding">
                                Tu compra fue procesada exitosamente 😎, el código de tu compra es '${res.shortid}'.<br>
                                En cualquier momento puedes ver el proceso de envío 💪.
                                <div class="buttons is-centered" style="margin-top:1rem">
                                    <button type="button" class="button is-white is-rounded">Aceptar</button>
                                </div>
                            </div>
                            `,
                        position: 'center',
                        type: 'is-primary',
                        dismissible: true,
                        closeOnClick: false,
                        pauseOnHover: true,
                        duration: 10000,
                        animate: { in: 'fadeIn', out: 'fadeOut' }
                    })
                    this.buyer = {
                        name: '',
                        address: '',
                        city: '',
                        phone: undefined,
                        email: ''
                    }
                    this.info = ''
                }
                else toast({
                    message: `
                        <div class="container padding">
                            Ocurrió un error inesperado 😪.
                            <div class="buttons is-centered" style="margin-top:1rem">
                                <button type="button" class="button is-white is-rounded">Aceptar</button>
                            </div>
                        </div>
                        `,
                    position: 'center',
                    type: 'is-warning',
                    dismissible: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    animate: { in: 'fadeIn', out: 'fadeOut' }
                })
                this.waitCheckout = false
            })
        } else {
            this.productService.checkout(order, this.tabPayu).subscribe(async res => {
                let order: Order = (<any>res).order
                if (order.shortid != undefined) {
                    //this.productService.deleteCart()
                    let orders: Order[] = JSON.parse(localStorage.getItem('orders'))
                    if (orders != undefined && orders.length != 0) orders.push(order)
                    else orders = [order]
                    localStorage.setItem('orders', JSON.stringify(orders))
                    //let { merchantId, accountId, signature, url } = (<any>res).payu
                    let payu = (<any>res).payu
                    let desc = order.items.length > 1? `Multiples productos - ${Constants.title}`: `${Constants.title} - ${order.items[0].product.description}`
                    payu = {
                        ...payu,
                        description: desc,
                        referenceCode: order.shortid,
                        amount: order.total,
                        currency: 'COP',
                        test: 1,
                        buyerEmail: order.buyer.email,
                        responseUrl: Constants.url,
                        confirmationUrl: Constants.payu_url,
                        algorithmSignature: 'SHA256',
                        mobilePhone: order.buyer.phone,
                        tax: 0
                    }
                    await Object.entries(payu).reduce((a, [k, v]) => {
                        let inp = this.renderer.createElement('input')
                        this.renderer.setAttribute(inp, 'name', k)
                        this.renderer.setAttribute(inp, 'type', 'hidden')
                        this.renderer.setProperty(inp, 'value', <string>v)
                        this.renderer.appendChild(this.payuForm.nativeElement, inp)
                        return {}
                    }, {})
                    this.payuForm.nativeElement.submit()
                }
                else toast({
                    message: `
                        <div class="container padding">
                            Ocurrió un error inesperado 😪.
                            <div class="buttons is-centered" style="margin-top:1rem">
                                <button type="button" class="button is-white is-rounded">Aceptar</button>
                            </div>
                        </div>
                        `,
                    position: 'center',
                    type: 'is-warning',
                    dismissible: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    animate: { in: 'fadeIn', out: 'fadeOut' }
                })
                this.waitCheckout = false
            })
        }
    }

    test(){
        console.log(this.buyer)
        this.payuForm.nativeElement.submit()
    }

}
