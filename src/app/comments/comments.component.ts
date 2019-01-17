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
  newComment : string = "";
  name : string = "";
  count : number = 0;
  error : boolean = false;
  cError : boolean = false;

  constructor(private ngxService: NgxUiLoaderService, private apollo: Apollo, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.ngxService.start();
    this.getComments();
  }

  respond(comment) {
    document.getElementById('respond').scrollIntoView();

    this.respondComment = comment;
  }

  cancelRespond() {
    this.respondComment = {};
  }

  navigateTo(id) {
    document.getElementById('comment-' + id).scrollIntoView();
  }


  comment() {
    this.error = false;
    if (this.newComment.length == 0) {
      this.cError = true;
    } else {
    var parentId = this.respondComment.id == undefined ? 0 : this.respondComment.id;
    const leaveComment = gql`mutation newComment {
      newComment(post: ${this.post}, content:"${this.newComment}", parent : ${parentId}, author_name : "${this.name}") {
        id,
        content,
        author_name,
        date
      }
    }
   `;
   

   this.apollo.mutate({
    mutation: leaveComment
  }).subscribe(({ data }) => {
    this.name = "";
    this.newComment = "";
    this.getComments(true, data.newComment.id);
  },(error) => {
    this.error = true;
  });
}
  }
 

  getComments(navigate : boolean = false, id : number = 0) {
    const getComments = gql`{
      comments(per_page : 100, orderby : "date", post: "${this.post}", parent: "0") {
       id,
       author_name,
       date,
    	 content
    	children {
      	id,
      	author_name,
      	date,
        content,
        children {
          id,
          author_name,
          date,
          content
          children {
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
        this.setCount(this.comments);
        if (navigate) {
          document.getElementById('comments').scrollIntoView();
        }
        this.ngxService.stop();
      })
  }

  setCount(comments : any[]) {
    this.count = 0;
    for (let comment of comments) {
      this.count++;
      for (let child of comment.children) {
        this.count++;
        for (let child2 of child.children) {
          this.count++;
          for (let child3 of child2.children) {
            this.count++;
            for (let child4 of child3.children) {
              this.count++;
            }
          }
        }
        
      }
    }
  }


  check() {
    if (!this.cError)
      return;
    else {
      if (this.newComment.length > 0)
        this.cError = false;
    }
  }
}
