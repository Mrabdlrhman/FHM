import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl ,Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, ParamMap,Router } from '@angular/router';
import {Post} from '../../models/posts'
import { mimeType } from './mime-type.validator';




@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrls: ['./create-posts.component.css']
})
export class CreatePostsComponent implements OnInit {
  form:FormGroup;
  imagePreview:any;
  entredTitle: string = "";
  entredContent: string = "";
  postId:string;
  mode:string="create";
  post:Post;
  isLoading:boolean=false;


  // postCreated = new EventEmitter<Post>();//defin generic type we add this <>
  constructor(
    private postService:PostsService,
    private route:ActivatedRoute,
    private router:Router
    ) { }

  ngOnInit() {
    //defin the forms control
    this.form=new FormGroup({
      title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),

      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})


    });



    this.route.paramMap.subscribe((paramMap:ParamMap)=> {
      //here to know which form creat or edit.if it has postid it is edit.
     if(paramMap.has('postId')){
       this.mode="edit";
       this.postId=paramMap.get('postId');
        //show spnier when fetch data
        this.isLoading=true;

       this.postService.getPost(this.postId).subscribe(postInfo => {
         //hide spnier after fetch data
         this.isLoading=false;
         this.post={id:postInfo._id,title:postInfo.title,content:postInfo.content,imagePath:postInfo.imagePath,creator:postInfo.creator};
        
         //to show the data in the form after click edit
         this.form.setValue({title:this.post.title,content:this.post.content, image:this.post.imagePath});

       });
       
       

     }else{
      this.mode="create";
      this.postId=null;
     }
    });

  }

  onImagePicked(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
   //convert the image to data url to preview it
   const reader =new FileReader();
   reader.onload = () => {
    this.imagePreview=reader.result;
   };
   reader.readAsDataURL(file);

  }
  onSavePost() {
    if (this.form.valid) {
      if(this.mode==="create"){
        this.postService.addPost(this.form.value.title,this.form.value.content,this.form.value.image);
      }else{
        this.postService.updatePost(this.postId,this.form.value.title,this.form.value.content,this.form.value.image);
      }
      this.form.reset();
      // this.router.navigate(["/"]);
    }

  }
  
}
