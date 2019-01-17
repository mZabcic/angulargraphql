import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})

// TODO PAGINACIJA
export class SubCategoryComponent implements OnInit {

  categoryName : String;
  posts : any;
  category : any;
  page : number = 1;
  pages : number = 0;

  constructor(private activatedRoute: ActivatedRoute, private ngxService: NgxUiLoaderService, private apollo: Apollo, private route : Router) {
   

   


    this.activatedRoute.params.subscribe(params => {
      this.categoryName = params['subcategory']; 
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
        this.category = data[0];
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
        },
        categories_object {
          name,
          link,
        },
        pagination {
          totalPages
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
             this.pages = data[0].pagination.totalPages; 
         this.posts = data;
         this.ngxService.stop();
        })
   });
  });
   }

  ngOnInit() {
    this.ngxService.start();
  }

  paginate(page : number) {
    this.page = page;

    this.getData();
  }

  nextPage() {
    this.page++;
    this.paginate(this.page);
  }

  previousPage() {
    this.page--;
    this.paginate(this.page);
  }


  getData() {
    this.posts = [];
    const getPost = gql`{
      posts(per_page : 10, orderby : "date", categories: "${this.category.id}", page : ${this.page}) {
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
  }


  generatePagination() : Array<any> {
    var value = new Array<any>();
    if (this.pages < 5) {
      for (var i = 1; i <= this.pages; i++) {
         value.push({value : i, active : this.page == i ? true : false});
      }
    } else {
      if (this.page == 1) {
        for (var i = this.page; i <= this.page + 2; i++) {
          value.push({value : i, active : this.page == i ? true : false});
        }
        value.push({value : '...' , active : true});
        value.push({value : this.pages, active : false});
      } else if (this.page == this.pages) {
        value.push({value : 1, active : false});
        value.push({value : '...' , active : true});
        for (var i = this.page - 2; i <= this.page; i++) {
          value.push({value : i, active : this.page == i ? true : false});
      }
    } else {
      if (this.page != 2) {
        value.push({value : 1, active : false});
         value.push({value : '...' , active : true});
      }
      for (var i = this.page - 1; i <= this.page + 1; i++) {
        value.push({value : i, active : this.page == i ? true : false});
      }
      if (this.page != this.pages - 1) {
        value.push({value : '...' , active : true});
        value.push({value : this.pages, active : false});
      }
    } 
    }
    return value;
  }





}
