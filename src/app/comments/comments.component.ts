import { Component, OnInit, Input } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input('post') post: number;
  @Input('postName') postName: string;
  comments : any[];
  respondComment : any = {}; 
  newComment : string;
  name : string;

  constructor(private ngxService: NgxUiLoaderService, private apollo: Apollo, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.ngxService.start();
    const getComments = gql`{
      comments(per_page : 100, orderby : "date", post: "192", parent: "0") {
       id,
       author_name,
       date,
    	 content
    	children {
      	id,
      	author_name,
      	date,
      	content
    	}
  }
} 
   `;

    this.apollo
      .watchQuery({
        query: getComments,
        fetchPolicy: "network-only"
      })
      .valueChanges.pipe(map(((result: any) => result.data.comments))).subscribe(data => {
        this.comments = data;
        this.ngxService.stop();
      })
  }

  respond(comment) {
    this.respondComment = comment;
  }

  cancelRespond() {
    this.respondComment = {};
  }

  navigateTo(id) {

  }
 


}
