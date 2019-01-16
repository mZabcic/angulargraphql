import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

// TODO PAGINACIJA
export class CategoryComponent implements OnInit {

  categoryName : String;
  posts : any;
  category : any;


  constructor(private activatedRoute: ActivatedRoute, private ngxService: NgxUiLoaderService, private apollo: Apollo, private route : Router) {
   

   


    this.activatedRoute.params.subscribe(params => {
      this.categoryName = params['category']; 
      const getCategory = gql`
    {
      categories(per_page : 100, hide_empty : 1, slug : "${this.categoryName}") {
        id,
       name      
      } 
    }
  `;
      
     this.apollo
     .watchQuery({
       query: getCategory,
       fetchPolicy: "network-only"
     })
     .valueChanges.pipe(map(((result: any) => result.data.categories)))
     .subscribe(data => {
      if (data.length > 0) {
        var id = data[0].id;
      } else {
       this.ngxService.stop();
       this.route.navigate(['/']);
        return;
      }
      
      const getPost = gql`{
        posts(per_page : 10, orderby : "date", categories: "${id}") {
         date,
         slug,
         title,
         excerpt,
         link,
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
  });
   }

  ngOnInit() {
    this.ngxService.start();
  }





}
