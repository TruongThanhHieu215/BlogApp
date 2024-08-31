import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { IBlog } from 'src/model/blog.model'

const BASE_URL = 'https://mock-api.nals.vn'
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private readonly httpClient: HttpClient) {}

  getListBlogs(param?: {}) {
    return this.httpClient.get<IBlog>(`${BASE_URL}/api/v2/blogs`, {
      params: param
    })
  }
  getDetailBlogs(blogId: number) {
    return this.httpClient.get<IBlog>(`${BASE_URL}/api/v2/blogs/${blogId}`)
  }

  createBlog(blog: IBlog) {
    return this.httpClient.post<IBlog>(`${BASE_URL}/api/v2/blogs`, blog)
  }

  updateBlog(blogId: number, blog: IBlog) {
    return this.httpClient.put<IBlog>(
      `${BASE_URL}/api/v2/blogs/${blogId}`,
      blog
    )
  }

  deleteBlog(blogId: number) {
    return this.httpClient.delete(`${BASE_URL}/api/v2/blog/${blogId}`)
  }
}
