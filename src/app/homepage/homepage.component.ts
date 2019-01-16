import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  categoryList : Array<any> = new Array<any>();
  latest : any;
  posts : Map<number, any> = new Map<number, Array<any>>();

  constructor(private apollo: Apollo, private ngxService: NgxUiLoaderService) { 
    this.posts = new Map<number, Array<any>>();
  }

  ngOnInit() {
    this.ngxService.start();
    this.getData();
    this.getLatest();



  }


  getData() : void {
    const getCategories = gql`
    {
      categories(per_page : 100, hide_empty : 1) {
        id,
        name,
        link,
        parent
      } 
    }
  `;

  this.apollo
    .watchQuery({
      query: getCategories,
      fetchPolicy: "network-only"
    })
    .valueChanges.pipe(map(((result: any) => result.data.categories)))
    .subscribe(data => {
      this.categoryList = data;
      this.categoryList = this.categoryList.filter(e => e.parent == 0);
      for (let category of this.categoryList) {
        var cat : String = category.id.toString();
        const getPosts = gql`{
          posts(per_page : 4, orderby : "date", categories: "${cat}") {
           date,
           slug,
           title,
           excerpt,
           link
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
              query: getPosts,
              variables: {
                categories: category.id.toString(),
              },
              fetchPolicy: "network-only"
            })
            .valueChanges.pipe(map(((result: any) => result.data.posts))).subscribe(data => {
          this.posts.set(category.id, data);
        })
        this.ngxService.stop();
      }
    });
  }


  getLatest() {
    const getLatest = gql`{
      posts(per_page : 3, orderby : "date") {
       modified,
       title,
       excerpt,
       link
     }
   } 
   `;

   this.apollo
            .watchQuery({
              query: getLatest,
              fetchPolicy: "network-only"
            })
            .valueChanges.pipe(map(((result: any) => result.data.posts))).subscribe(data => {
         this.latest = data;
        })
  }
}
