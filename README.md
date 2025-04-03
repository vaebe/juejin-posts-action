# juejin-posts-action

获取掘金文章在 README 文件中展示

## 开始使用

在 README.md 中写入如下内容

```bash
<!-- juejin-posts start -->
# 这里就是填充文章内容的地方
<!-- juejin-posts end -->
```

在项目的根目录创建 `.github/workflows/update_readme_article_list.yml` 文件 写入如下内容

```yml
name: Update Readme Article list

on:
  schedule:
    - cron: '30 22 * * *' # 每天 UTC 时间 22:30 运行
  workflow_dispatch: # 允许手动触发

jobs:
  juejin-posts:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Append Juejin Posts List 📚
        uses: vaebe/juejin-posts-action@main
        with:
          user_id: '712139266339694' # 你的 Juejin 用户 ID

      - run: git pull
      
      - name: Push to GitHub
        uses: EndBug/add-and-commit@v9
        with:
          default_author: github_actions
          message: juejin-posts
```

## 参考仓库

[multi-platform-posts-action](https://github.com/baozouai/multi-platform-posts-action)
