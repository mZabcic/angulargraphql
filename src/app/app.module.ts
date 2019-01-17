import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule }    from '@angular/common/http';
import { HomepageComponent } from './homepage/homepage.component';
import { GraphQLModule } from "./graphql.module";
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

// requires BrowserAnimationsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import HeadroomModule
import { HeadroomModule } from '@ctrl/ngx-headroom';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { CategoryComponent } from './category/category.component';
import { LatestComponent } from './latest/latest.component';
import { PostComponent } from './post/post.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from './comments/comments.component';
import { LOCALE_ID } from '@angular/core';
import localeHr from '@angular/common/locales/hr';
import { registerLocaleData } from '@angular/common';
import { SubCategoryComponent } from './sub-category/sub-category.component'

// the second parameter 'fr' is optional

registerLocaleData(localeHr, 'hr');

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    LatestComponent,
    PostComponent,
    SearchComponent,
    CommentsComponent,
    SubCategoryComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    BrowserAnimationsModule,
    HeadroomModule,
    NgxUiLoaderModule,
    FormsModule
  ],
  providers: [ { provide: LOCALE_ID, useValue: 'hr' } ],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
