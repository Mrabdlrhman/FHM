import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router:Router,
    private authServies:AuthService
) { }

canActivate():boolean | Observable<boolean> | Promise<boolean> {
    const isAuth=this.authServies.getIsAuth();
    if(!isAuth){
        this.router.navigate(['/login']);
    }
 return isAuth;
}
  
}
