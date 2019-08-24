import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



const BACKEND_URL=environment.apiUrl+"/user/";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenicated: boolean = false;
  toekn: string;
  tokenTimer: any;
  userId:string;//here we can creat model that contain userid,fullname,etc
  authStatusListener = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private route: Router
  ) { }

  signUp(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<{ message: string }>(BACKEND_URL+"signup", authData).subscribe(resp => {
      this.route.navigate(['/']);
    },error => {
      this.authStatusListener.next(false);
    });

  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient.post<{ message: string, token: string, expiresIn: number,userId:string }>(BACKEND_URL+"login", authData).subscribe(resp => {
      console.log(resp.message);
      console.log(resp.token);

      const toekn = resp.token;
      this.toekn = toekn;
      if (toekn) {
        const expirToken = resp.expiresIn;
        //here to decide the token expeir after one hour
        this.setAuthTimer(expirToken);
        this.isAuthenicated = true;
        this.userId=resp.userId;//for authorization

        this.authStatusListener.next(true);
        //save the token to local storge
        const nowDate = new Date();
        const expirDate = new Date(nowDate.getTime() + expirToken * 1000);
        this.saveAuthData(toekn, expirDate,this.userId);


        this.route.navigate(['/']);
      }

    }, error => {
      this.authStatusListener.next(false);
    });

  }
  logout() {
    this.toekn = null;
    this.isAuthenicated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId=null;
    this.clearAuthData();
    this.route.navigate(['/']);


  }
  //here to allow the other services shuch as post service to use the token and make request to add ,edit and delete.
  getToken() {
    return this.toekn;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  //this for post page
  getIsAuth() {
    return this.isAuthenicated;
  }

  setAuthTimer(expirToken: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expirToken * 1000);
  }

  saveAuthData(token: string, expeirDate: Date,userId:string) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('expeirDate', expeirDate.toISOString());
    sessionStorage.setItem('userId', userId);

  }
  clearAuthData() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expeirDate');
    sessionStorage.removeItem('userId');

  }
  getAuthData() {
    const token = sessionStorage.getItem('token');
    const expairDate = sessionStorage.getItem('expeirDate');
    const userId = sessionStorage.getItem('userId');
    if (!token || !expairDate) {
      return;
    }
    return {
      token: token,
      expairDate: new Date(expairDate),
      userId:userId
    }

  }

  //this keep the user authnticated even when refersh the page
  automatAuthUsers() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    //check if token expair or not(if nagtive num)
    const now = new Date();
    const expairIn = authInformation.expairDate.getTime() - now.getTime();
    if (expairIn > 0) {
      this.toekn = authInformation.token;
      this.isAuthenicated = true;
      this.userId=authInformation.userId;
      this.setAuthTimer(expairIn / 1000);//divid to 1000 convert it to milisecond
      this.authStatusListener.next(true);
    }
  }

  getUserId(){
    return this.userId;
  }
}
