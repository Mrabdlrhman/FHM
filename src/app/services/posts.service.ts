import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {Post} from '../models/posts'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



const BACKEND_URL=environment.apiUrl+"/posts/";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
private posts:Post[]=[];
private postsUpdated=new Subject<{posts:Post[],postCount:number}>();

  constructor(private httpClint:HttpClient, private router:Router) { }

  /**********Get all posts ************/
  getPosts(postsPerPage:number,currentPage:number){
    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClint.get<{message:string,posts:any,countPosts:number}>(BACKEND_URL+queryParams)
    //here to chnage the _id to id we tranform it using map
    .pipe(map((postData)=> {
      return {postsData :postData.posts.map(res => {
        return {
          id:res._id,
          title:res.title,
          content:res.content,
          imagePath:res.imagePath,
          creator:res.creator
        };
      }),countPosts:postData.countPosts};

    }))
    
    .subscribe((transformedPostData)=>{
     
     this.posts= transformedPostData.postsData;
     this.postsUpdated.next({posts:[... this.posts],postCount:transformedPostData.countPosts});

    });
  }
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  /**********Get single post************/
  getPost(id:string){
    return this.httpClint.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+id);
  }

  /**********add post************/
  addPost(title:string,content:string,image:File){
    // const post:Post={id:null,title:title,content:content};
    const postData =new FormData();
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image,title);


    this.httpClint.post<{message:string,post:Post}>(BACKEND_URL,postData).subscribe((responseData)=>{
    //here we overide the null id and saved the generted id
    // const post:Post={id:responseData.post.id,title:title,content:content,imagePath:responseData.post.imagePath};
 
    //Post to local post if we have success message from server
    // this.posts.push(post);
    // this.postsUpdated.next([...this.posts]); 
    this.router.navigate(["/"]);
     
    });

  }

  /**********delete post ************/
  deletePost(postId:string){
    //if you want subscrib in the ts file return the result
    return this.httpClint.delete(BACKEND_URL+postId);
    // .subscribe(() => {
    //   //here when delet post from db we update the UI to show it deleted
    //   const updatedPosts=this.posts.filter(infoPost => infoPost.id !== postId);
    //   this.posts=updatedPosts;
    //   this.postsUpdated.next([... this.posts]);
    // })

  }

    /**********update post ************/
    updatePost(id:string,title:string,content:string,image:File | string){
      
      let postData:Post | FormData;
      if(typeof image ==='object'){
         postData =new FormData();
        postData.append("id",id);
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);

      }else{
         postData={id:id,title:title,content:content,imagePath:image,creator:null};
      }


      this.httpClint.put(BACKEND_URL+id,postData)
      .subscribe(respons => {
        //localy update the post when success
        // const copyPost=[...this.posts];//take copy of updated
        // const oldPostIndex=copyPost.findIndex(p => p.id === id);
        // const updatedPost:Post={id:id,title:title,content:content,imagePath:""};

        // copyPost[oldPostIndex]=updatedPost;
        // this.posts=copyPost;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);

      })

    }
}
