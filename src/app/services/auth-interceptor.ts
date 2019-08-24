import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()

//we use this class to help the method add, edit and delete to send request with attached token to verfiy the user.

export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService:AuthService) { }


    //here we send request then we use next to allow our other parts of app continue working , it work as middlaware
    intercept(req:HttpRequest<any>,next:HttpHandler){
        const authToken=this.authService.getToken();
        //here we add the token to the request url
        const authRequest=req.clone({
            headers:req.headers.set('Authorization',"Bearer " + authToken)
        });
        return next.handle(authRequest);
    }
}