import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../interfaces/User'
import { Router } from '@angular/router'
import { Constants } from '../constants'

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private router: Router) { }

    authCodes = Object.freeze({
        SIGNUP_OK: 0,
        USER_EXISTS: 1,
        EMAIL_EXISTS: 2,
        WRONG_USER: 3,
        WRONG_PASSWORD: 4,
        EMPTY_U_P_E: 5,         //  User    Password    Email
        DB_ERROR: 6,
        LOGOUT_OK: 7,
        LOGOUT_ERROR: 8,
        NOT_LOGGEDIN: 9,
        LOGGEDIN: 10,
        LOGIN_ERROR: 11,
        LOGIN_OK: 12,
        USER_UPDATED_OK: 13
    })

    API_URI = Constants.API_URI

    user: User
    public static token: string

    checkToken(){
        this.http.post<User>(this.API_URI+'/user/check-token', { token: UserService.token }).subscribe(res => {
            this.user = res
            if(this.user.authCode == this.authCodes.NOT_LOGGEDIN){
                UserService.token = undefined
                localStorage.removeItem('token')
                this.router.navigate(['/admin/login'])
            }
        }, err => console.log(err))
    }

    login(username, password):Observable<User>{
        let prom = this.http.post<User>(this.API_URI+'/user/login', { username, password })
        prom.subscribe(res => {
            this.user = res
            if(this.user.authCode == this.authCodes.LOGIN_OK){
                UserService.token = this.user.token
                localStorage.setItem('token', UserService.token)
                this.router.navigate(['/admin'])
            }
        }, err => console.log(err))
        return prom
    }

    onInit(){
        UserService.token = localStorage.getItem('token')
        if(UserService.token) this.checkToken()
    }

}
