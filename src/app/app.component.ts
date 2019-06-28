import { Component, OnInit } from '@angular/core'
import { UserService } from './Services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

    constructor(private userServices: UserService) { }

    ngOnInit(){
        this.userServices.onInit()
    }

}
