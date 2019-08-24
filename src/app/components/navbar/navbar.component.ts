import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 authListenerSub:Subscription;
 userIsAuthenicated:boolean=false;

  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.userIsAuthenicated=this.authService.getIsAuth();
    
    this.authListenerSub=this.authService.getAuthStatusListener().subscribe(isAuthenicated => {
     this.userIsAuthenicated=isAuthenicated;
    });
    
  } 
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authListenerSub.unsubscribe();

  }
   
}
