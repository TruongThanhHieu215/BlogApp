export interface IBlog {
  id: number
  title: string
  content: string
  image: {
    url: string
  }
}

export interface IPagination {
  count: number
  page: number
  offset: number
  search: string
  sort_by: string
  sort_direction: string
}
