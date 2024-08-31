import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { allIcons, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'
import { DestroyService } from 'src/services/destroy.service'
import { BlogCreateEditComponent } from './blog-create-edit/blog-create-edit.component'
import { BlogDetailComponent } from './blog-detail/blog-detail.component'
import { BlogListComponent } from './blog-list/blog-list.component'

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: BlogListComponent
  },
  {
    path: 'create',
    component: BlogCreateEditComponent
  },
  {
    path: 'edit/:idBlog',
    component: BlogCreateEditComponent
  },
  {
    path: 'list/:idBlog',
    component: BlogDetailComponent
  }
]

@NgModule({
  declarations: [ 
    BlogListComponent,
    BlogDetailComponent,
    BlogCreateEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    NgxBootstrapIconsModule.pick(allIcons),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DestroyService]
})
export class BlogModule {}
