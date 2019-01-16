import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent }             from './homepage/homepage.component';
import { CategoryComponent }             from './category/category.component';
import { PostComponent } from './post/post.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'search', component: SearchComponent},
  { path: ':slug', component: PostComponent},
  { path: 'kategorija/:category', component: CategoryComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}