import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { AppConfig } from '../app-config';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  menuList : any;
  term : String;

  constructor(private apollo: Apollo, private route : Router) { }

  ngOnInit() {
    const getHeaderNav = gql`
    {
      menus(slug:"header_main_nav") {
        items {
          title,
          url
        }
      }
    }
  `;

  this.apollo
    .watchQuery({
      query: getHeaderNav,
      fetchPolicy: "network-only"
    })
    .valueChanges.pipe(map(((result: any) => result.data.menus)))
    .subscribe(data => {
      this.menuList = data[0].items;
      this.menuList = this.getLinksReady(this.menuList);
    });
  }



  getLinksReady(links) {
    var newLinks = new Array<any>();
    for (let link of links) {
      link.url = link.url.replace(AppConfig.WP_ADDRESS, '');
      newLinks.push(link);
    }
    return newLinks;
  }

  search() {
    this.route.navigate(['/search'], { queryParams: { s: this.term } });
    this.term = "";
  }
}
