import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { map, switchMap, takeUntil } from 'rxjs'
import { IBlog } from 'src/model/blog.model'
import { BlogService } from 'src/services/blog.service'
import { DestroyService } from 'src/services/destroy.service'
import { LoadingService } from 'src/services/loading.service'

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blog: IBlog = {
    id: 0,
    title: '',
    content: '',
    image: {
      url: ''
    }
  }
  constructor(
    private blogService: BlogService,
    private DestroyService: DestroyService,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadingService.loadingOn()
    this.activatedRoute.params
      .pipe(
        map((params) => params['idBlog']),
        switchMap((idBlog: number) => this.blogService.getDetailBlogs(idBlog)),
        takeUntil(this.DestroyService.destroyed$)
      )
      .subscribe({
        next: (res: any) => {
          this.blog = res.data
          this.loadingService.loadingOff()
        },
        error: (err) => {
          this.loadingService.loadingOff()
        }
      })
  }

  goBack(): void {
    this.router.navigate(['/blog'])
  }
}
