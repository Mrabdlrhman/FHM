import { Component, OnInit} from '@angular/core';
import { Subscription, from } from 'rxjs';
import {Post} from '../../models/posts';
import { PostsService } from 'src/app/services/posts.service';
import{PageEvent} from '@angular/material'
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit{
// posts:any=[
//   {title:"First Post", content:"this is the first post"},
//   {title:"Second Post", content:"this is the second post"}
// ];

posts:Post[]=[];
isLoading:boolean=false;
totalPosts:number=0;
postPerPage:number=2;
currentPage:number=1;
pageSizeOption=[1,2,5,10];
private postSub:Subscription;
authListenerSub:Subscription;
userIsAuthenicated:boolean=false;
userId:string;

  constructor(
    private postService:PostsService,
    private authService:AuthService
    ) { }

  ngOnInit() {
    this.isLoading=true;
    this.postService.getPosts(this.postPerPage,this.currentPage);
    
   this.postSub= this.postService.getPostUpdateListener().subscribe((postInfo:{posts:Post[],postCount:number})=>{
     this.isLoading=false;
     this.totalPosts=postInfo.postCount;
      this.posts=postInfo.posts;

    }); 
    //this when first visit the page after login
    this.userIsAuthenicated=this.authService.getIsAuth();
    
    //check user authenticated or not , if not not show the edit and delete button
    this.authListenerSub=this.authService.getAuthStatusListener().subscribe(isAuthenicated => {
      this.userIsAuthenicated=isAuthenicated;
      //autorization to edit and delete
     this.userId=this.authService.getUserId();
     });


     //autorization to edit and delete
     this.userId=this.authService.getUserId();
  }
  onChangedPage(pageeData:PageEvent){
    this.isLoading=true;
    this.currentPage=pageeData.pageIndex+1;
    this.postPerPage=pageeData.pageSize;
    this.postService.getPosts(this.postPerPage,this.currentPage);

  }
  onDelete(postId:string){
    this.isLoading=true;
   this.postService.deletePost(postId).subscribe(() => {
     //here we fetch all data to update the pagniation
     this.postService.getPosts(this.postPerPage,this.currentPage);
   }, () => {
     this.isLoading=false;
   });
  }
 
  ngOnDestroy(){
  this.postSub.unsubscribe();
  this.authListenerSub.unsubscribe();
  }

}
