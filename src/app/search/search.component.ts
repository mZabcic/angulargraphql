import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  term : String;
  posts : any[];

  constructor(private activatedRoute: ActivatedRoute, private ngxService: NgxUiLoaderService, private apollo: Apollo, private route : Router) {
   

   


    this.activatedRoute.queryParams.subscribe(params => {
      this.term = params['s']; 
      this.term = this.term == undefined ? "" : this.term;
      const getPost = gql`{
        posts(per_page : 10, orderby : "date", search: "${this.term}") {
         date,
         slug,
         title,
         excerpt,
         link,
         content
         featured_image_info {
          url
        }
        categories_object {
          name,
          link,
        }
       }
     } 
     `;
   
     this.apollo
            .watchQuery({
              query: getPost,
              fetchPolicy: "network-only"
            })
            .valueChanges.pipe(map(((result: any) => result.data.posts))).subscribe(data => {
        
         this.posts = data;
         this.ngxService.stop();
        })
   });
   }

  ngOnInit() {
    this.ngxService.start();
  }


  search() {
    this.route.navigate(['/search'], { queryParams: { s: this.term } });
    this.term = "";
  }

 



}
