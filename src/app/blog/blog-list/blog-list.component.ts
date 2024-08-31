import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  takeUntil
} from 'rxjs'
import { limits, pagination, sortBy } from 'src/constants/blog.constant'
import { IBlog } from 'src/model/blog.model'
import { BlogService } from 'src/services/blog.service'
import { DestroyService } from 'src/services/destroy.service'
import { LoadingService } from 'src/services/loading.service'

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  model: any
  @ViewChild('inputField') inputField!: ElementRef
  sortBy = sortBy
  limits = limits
  pagination = pagination

  data: IBlog[] = []
  constructor(
    private readonly blogService: BlogService,
    private readonly router: Router,
    private readonly activatedRouted: ActivatedRoute,
    private destroy: DestroyService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.activatedRouted.queryParams
      .pipe(takeUntil(this.destroy.destroyed$))
      .subscribe((params: any) => {
        if (params['search']) {
          this.pagination.search = params['search']
        }
        if (params['limit']) {
          this.pagination.offset = Number(params['limit'])
        }
        if (params['sort_by']) {
          this.pagination.sort_by = params['sort_by']
        }
        if (params['sort_direction']) {
          this.pagination.sort_direction = params['sort_direction']
        }

        this.getListBlog(params)
      })
  }

  getListBlog(params: {}) {
    this.loadingService.loadingOn()
    this.blogService
      .getListBlogs(params)
      .pipe(takeUntil(this.destroy.destroyed$))
      .subscribe({
        next: (result: any) => {
          this.data = result.data.items
          this.pagination = {
            ...this.pagination,
            count: result.pagination.count,
            offset: result.pagination.offset || this.pagination.offset,
            page: result.pagination.page
          }
          this.loadingService.loadingOff()
        },
        error: (error) => {
          this.loadingService.loadingOff()
        }
      })
  }

  ngAfterViewInit() {
    this.initializeInputField()
  }

  private initializeInputField() {
    fromEvent<Event>(this.inputField.nativeElement, 'input')
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        map((event: Event) => (event.target as HTMLInputElement).value)
      )
      .subscribe((input) => this.navigateWithQueryParams({ search: input }))
  }

  sort(type: string) {
    this.pagination = {
      ...this.pagination,
      sort_direction: type
    }
  }

  navigateTo(link: string) {
    this.router.navigateByUrl(link)
  }
  navigateWithQueryParams(params:  Record<string, string | number> = {}) {
    this.router.navigate(['/blog/list'], {
      queryParams: {
        ...this.pagination,
        ...params
      }
    })
  }
}
