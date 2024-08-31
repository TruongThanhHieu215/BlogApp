import { IPagination } from 'src/model/blog.model'

export const sortBy: string[] = [
  'id',
  'title',
  'content',
  'created_at',
  'updated_at'
]
export const limits: number[] = [10, 20, 50, 100]

export const pagination: IPagination = {
  count: 0,
  page: 1,
  offset: 20,
  search: '',
  sort_by: 'created_at',
  sort_direction: 'asc'
}
