import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Route, Router } from '@angular/router'
import { filter, map, switchMap, takeUntil, tap } from 'rxjs'
import { BlogService } from 'src/services/blog.service'
import { DestroyService } from 'src/services/destroy.service'
import { LoadingService } from 'src/services/loading.service'
import { ValidationService } from 'src/services/validation.service'

@Component({
  selector: 'app-blog-create-edit',
  templateUrl: './blog-create-edit.component.html',
  styleUrls: ['./blog-create-edit.component.scss']
})
export class BlogCreateEditComponent implements OnInit {
  formBlog: FormGroup = new FormGroup({})
  blogId: number | null = null
  previewImage: string = ''

  constructor(
    private fbd: FormBuilder,
    private validationService: ValidationService,
    private activatedRoute: ActivatedRoute,
    private DestroyService: DestroyService,
    private blogService: BlogService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.activatedRoute.params
      .pipe(
        map((params) => params['idBlog']),
        filter((idBlog) => !!idBlog),
        tap((idBlog) => {
          this.blogId = idBlog
          this.loadingService.loadingOn()
        }),
        switchMap((idBlog: number) => this.blogService.getDetailBlogs(idBlog)),
        takeUntil(this.DestroyService.destroyed$)
      )
      .subscribe({
        next: (res: any) => {
          this.formBlog.patchValue(res.data)
          this.previewImage = res.data.image.url
          this.loadingService.loadingOff()
        },
        error: (err) => {
          this.loadingService.loadingOff()
        }
      })
  }

  initForm() {
    this.formBlog = this.fbd.group({
      title: [
        '',
        Validators.compose([
          Validators.required,
          this.validationService.NoWhitespaceValidator()
        ])
      ],
      content: ['', Validators.required],
      image: this.fbd.group({
        url: ['', Validators.required]
      })
    })
  }
  onSubmit() {
    if (this.formBlog.invalid) {
      this.formBlog.markAllAsTouched() // This will trigger all validations to show
      return
    }
    this.loadingService.loadingOn()
    const apiBlog$ = this.blogId
      ? this.blogService.updateBlog(this.blogId, {
          ...this.formBlog.value,
          id: this.blogId
        })
      : this.blogService.createBlog({ ...this.formBlog.value })

    apiBlog$.pipe(takeUntil(this.DestroyService.destroyed$)).subscribe({
      next: (res) => {
        alert(this.blogId ? 'Update success' : 'Create success')
        this.router.navigate(['/blog'])
      },
      error: (err) => {
        alert(this.blogId ? 'Update fail' : 'Create fail')
        this.loadingService.loadingOff()
      }
    })
  }

  private getFileList(event: Event): File | null {
    const target: HTMLInputElement = event.currentTarget as HTMLInputElement
    return target.files ? target.files[0] : null
  }
  async onFileChange(fileEvent: Event) {
    const selectedFile: File | null = this.getFileList(fileEvent)
    if (selectedFile) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = () => {
          if (reader.result) {
            const base64_default = reader.result
            this.formBlog.get('image')?.setValue({
              url: base64_default
            })
            this.previewImage = base64_default as string
          }
        }
        reader.onerror = (error) => reject(error)
      })
    } else {
      return null
    }
  }
}
