import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:{message:string}) { }

  ngOnInit() {
  }

}
