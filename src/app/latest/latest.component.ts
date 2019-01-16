import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-latest',
  templateUrl: './latest.component.html',
  styleUrls: ['./latest.component.css']
})
export class LatestComponent implements OnInit {

  constructor(private apollo: Apollo) { }

  latest : any;

  ngOnInit() {
    this.getLatest();
  }

  getLatest() {
    const getLatest = gql`{
      posts(per_page : 3, orderby : "date") {
       modified,
       date,
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
