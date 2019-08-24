import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShowErrorComponent } from '../components/show-error/show-error.component';


@Injectable()
//we use this class to listen for respons error from the http url

export class ErrorInterceptor implements HttpInterceptor{
 constructor(public dialog: MatDialog){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
       
        return next.handle(req).pipe(
            catchError((error:HttpErrorResponse) => {
                let errorMessage="An unknwon error occurred";
                if(error.error.message){
                    errorMessage=error.error.message;

                }
                this.dialog.open(ShowErrorComponent, {data:{message:errorMessage}});
                // alert(error.error.message);

                return throwError(error);
            })
        );
    }
}