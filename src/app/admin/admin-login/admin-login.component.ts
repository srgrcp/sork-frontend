import { Component, OnInit } from '@angular/core'
import { Router } from "@angular/router"
import { UserService } from '../../Services/auth.service'
import { User } from 'src/app/interfaces/User'

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.sass']
})
export class AdminLoginComponent implements OnInit {

    username: string = ""
    password: string = ""
    user: User
    loginError: boolean = false
    loginMessage: string = ''
    loading: boolean = false

    constructor(
        private router: Router,
        private userServices: UserService
        ) { }

    ngOnInit() {
        if(localStorage.getItem('token')) this.router.navigate(['/admin'])
    }

    submit(){
        this.loading = true
        this.userServices.login(this.username, this.password).subscribe(res => {
            this.user = res
            if(this.user.authCode == this.userServices.authCodes.LOGIN_OK) this.router.navigate(['/admin'])
            else {
                this.loginError = true
                switch (this.user.authCode) {
                    case this.userServices.authCodes.WRONG_USER:
                        this.loginMessage = 'El usuario no es valido'
                    break;
                    case this.userServices.authCodes.WRONG_PASSWORD:
                        this.loginMessage = 'Contraseña incorrecta'
                    break;
                    default:
                        this.loginMessage = 'Ha ocurrido un error inesperado'
                    break;
                }
            }
            this.loading = false
        })
    }

}
