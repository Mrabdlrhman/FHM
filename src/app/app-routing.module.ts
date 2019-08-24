import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePostsComponent } from './components/create-posts/create-posts.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';



const routes: Routes = [
  {path:'', component:PostListComponent},//home page
  {path:'login', component:LoginComponent},
  {path:'signup', component:RegisterComponent},
  {path:'create', component:CreatePostsComponent,canActivate:[AuthGuard]},
  {path:'edit/:postId', component:CreatePostsComponent,canActivate:[AuthGuard]},



  {path:'**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
