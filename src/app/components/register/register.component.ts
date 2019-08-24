import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit,OnDestroy {
  isLoading:boolean=false;
  authStatusSub:Subscription;

  constructor(private authService:AuthService) { }

  ngOnInit() {
        //here we do this to infrom the entir app that we ar not authenticated and hide spinner
        this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus => {
          this.isLoading=false;
        });
        
  }

  onRegister(form:NgForm){
    if(form.valid){
      this.isLoading=true;
      this.authService.signUp(form.value.email,form.value.password);
    }
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
