import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule,MatCardModule,MatButtonModule,MatToolbarModule,MatExpansionModule,MatProgressSpinnerModule,MatPaginatorModule,MatDialogModule} from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreatePostsComponent } from './components/create-posts/create-posts.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostsService } from './services/posts.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth-interceptor';
import { ErrorInterceptor } from './services/error-interceptor';
import { ShowErrorComponent } from './components/show-error/show-error.component';





@NgModule({
  declarations: [
    AppComponent,
    CreatePostsComponent,
    NotFoundComponent,
    NavbarComponent,
    PostListComponent,
    LoginComponent,
    RegisterComponent,
    ShowErrorComponent

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [PostsService,AuthService,{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},{provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true}],
  bootstrap: [AppComponent],
  entryComponents:[ShowErrorComponent]
})
export class AppModule { }
