import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  slug : String;
  post : any;
  image : SafeHtml;

  constructor(private domSanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private ngxService: NgxUiLoaderService, private apollo: Apollo, private route : Router) {
   

   


    this.activatedRoute.params.subscribe(params => {
      this.slug = params['slug']; 
      const getPost = gql`{
        posts(per_page : 4, orderby : "date", slug: "${this.slug}") {
         date,
         id,
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
              console.log(data);
         if (data.length > 0) {
           this.post = data[0];
           this.image = this.transform(this.post.featured_image_info.url);
         } else {
          this.ngxService.stop();
          this.route.navigate(['/']);
           return;
         }
         this.ngxService.stop();
        })
   });
   }

  ngOnInit() {
    this.ngxService.start();
  }


  transform(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
 }




}
