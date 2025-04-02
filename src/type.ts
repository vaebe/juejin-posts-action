export interface JuejinArticleInfo {
  title: string
  ctime: string
  article_id: string
  digg_count: string
  collect_count: string
}

export interface CommonPost {
  /** 发布时间 */
  publish_time: string | number
  /** 标题 */
  title: string
  /** 链接 */
  link: string
  /** 点赞数 */
  star: number
  /** 收藏数 */
  collect: number | null
}
