import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.sass']
})
export class AlertComponent implements OnInit {

    action: boolean = false
    alert: boolean = false
    title: String = ''
    content: String = ''
    acceptAction: Function
    wait: boolean = false
    isImage: boolean = false
    image: string = ''

    constructor() { }

    ngOnInit() {
    }

    showImage(image: string){
        this.isImage = true
        this.image = image
        this.alert = true
        this.action = false
    }

    showAlert(title:String, content:String, fun?:Function){
        this.isImage = false
        if (fun) {
            this.acceptAction = fun
            this.action = true
        }
        else this.action = false
        this.title = title
        this.content = content
        this.alert = true
    }

    accept(){
        if (this.action) { this.wait = true;this.acceptAction(()=>{this.wait = false;this.alert = false}) }
        else this.alert = false
    }

}
