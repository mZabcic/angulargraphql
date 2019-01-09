import { Component, OnInit } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { AppConfig } from '../app-config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  menuList : any;

  constructor(private apollo: Apollo) { }

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
}
