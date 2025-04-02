import * as fs from 'node:fs'
import * as core from '@actions/core'
import { getAssetUrl, getJuejinList, getTimeDiffString } from './utils'

async function main(): Promise<void> {
  try {
    // 读取参数: 用户 ID
    const USER_ID = core.getInput('user_id')
    if (!USER_ID)
      throw new Error('User ID is required')

    core.info('1. 获取页面数据...')
    const commonPosts = await getJuejinList(USER_ID)

    core.info('2. 生成 HTML...')
    const platformSvgUrl = getAssetUrl('juejin.svg')
    const reduceText = commonPosts
      .map(({ title, publish_time, link, star, collect }) => {
        const time = getTimeDiffString(publish_time)
        return `<li align='left'>[${time} 👍：${star} ${collect ? `⭐：${collect}` : ''}] 
        <a href="${link}" target="_blank">${title}</a></li>`
      })
      .join('\n')

    const appendHtml = `
      <table align="center">
        <tr>
          <td align="center" width="800px" valign="top">
            <div align="center"><img src='${platformSvgUrl}' alt='juejin'/></div>
            <ul>${reduceText}</ul>
          </td>
        </tr>
      </table>
    `

    core.info('3. 读取 README...')
    const README_PATH = './README.md'
    const readmeContent = fs.readFileSync(README_PATH, 'utf-8')
    const updatedContent = readmeContent.replace(
      /(?<=<!-- juejin-posts start -->)[\s\S]*?(?=<!-- juejin-posts end -->)/,
      `\n${appendHtml}\n`,
    )

    core.info('4. 修改 README...')
    fs.writeFileSync(README_PATH, updatedContent)

    core.info('5. 修改结果:')
    core.info(updatedContent)
  }
  catch (error) {
    core.setFailed((error as Error).message)
  }
}

main()
